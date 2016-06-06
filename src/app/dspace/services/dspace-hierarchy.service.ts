import { EventEmitter, Injectable } from '@angular/core';

import { DSpaceService } from './dspace.service';
import { PagingStoreService } from './paging-store.service';
import { DSpaceConstantsService } from './dspace-constants.service';
import { PaginationService } from '../../navigation/services/pagination.service';
import { ObjectUtil } from '../../utilities/commons/object.util'

/**
 * Injectable service to provide navigation and context within the DSpace
 * hierarchy of objects. Essentially, this performs Browse by Community/Collection
 * functionality.
 */
@Injectable()
export class DSpaceHierarchyService {

    /**
     * The DSpace hierarchy
     */
    public hierarchy: Array<Object>;

    /**
     * Whether hierarchy is being loaded.
     */
    private loading: boolean;

    /**
     * Whether hierarchy is ready.
     */
    private ready: boolean;

    /**
     *
     * @param dspaceService
     *      DSpaceService is a singleton service to interact with the dspace REST API.
     * @param pagingStore
     *      PagingStoreService is a singleton service to cache context which have already been requested.
     * @param dspaceConstants
     *      DSpaceConstantsService is a singleton service with constants.
     * @param paginationService
     *      PaginationService is a singleton service for pagination controls.
     */
    constructor(private dspaceService: DSpaceService,
                private pagingStore: PagingStoreService,
                private dspaceConstants: DSpaceConstantsService,
                private paginationService: PaginationService) {
        this.hierarchy = new Array<Object>();
        this.loading = false;
        this.ready = false;
    }

    /**
     * Refresh the current context.
     *
     * @param context
     *      Current context
     */
    refresh(context?: any): void {
        
        // TODO: reduce redundancy
        
        if(context) {
            
            if(context.type == 'community') {
                
                this.pagingStore.clearPages(context);
                context.unload();
                context.limit = null;
                
                context.subcommunities.splice(0, context.subcommunities.length);
                context.collections.splice(0, context.collections.length);
                this.loadNav('community', context);
                this.loadNav('collection', context);
            }
            else if(context.type == 'collection') {
                
                this.pagingStore.clearPages(context);
                context.unload();
                context.limit = null;
                
                context.items.splice(0, context.items.length);
                this.loadNav('item', context);
                // currently only used while adding a new item
                // which needs to increment all its parents total item count
                this.incrementItemCount(context);
            }
            else {
                console.log('update item')
                // refresh the parent collection for when an item is updated
                // could maybe be more granular, such as search and replace with 
                // the input context seeing how it has the updates
                // the cache would have to be updated as well
                
                this.pagingStore.clearPages(context.parentCollection);
                context.parentCollection.unload();
                context.parentCollection.limit = null;
                
                context.parentCollection.items.splice(0, context.parentCollection.items.length);
                this.loadNav('item', context.parentCollection);
            }
        }
        else {
            this.ready = false;
            this.loadHierarchy();
        }
    }

    /**
     * Recursively increment the item count of all parent communities.
     *
     * @param context
     *      Current context
     */
    incrementItemCount(context: any): void {
        if(context.type == 'community') {
            context.countItems++;
        }
        else if(context.type == 'collection') {
            context.numberItems++;
        }
        if(context.parentCommunity) {
            this.incrementItemCount(context.parentCommunity);
        }
    }

    /**
     * Method to perform initial loading of the hierarchy.
     * Calls prepare with the top community results.
     */
    loadHierarchy(): void {
        if (!this.ready) {
            if (!this.loading) {
                this.loading = true;
                this.dspaceService.fetchTopCommunities().subscribe(topCommunities => {
                    this.hierarchy = this.prepare(null, topCommunities);
                },
                error => {
                    console.error('Error: ' + JSON.stringify(error, null, 4));
                },
                () => {
                    this.ready = true;
                    this.loading = false;
                    console.log('finished fetching top communities');
                });
            }
        }
    }

    /**
     * Method to load hierarchy navigation relations. Calls prepare with the context received.
     *
     * @param type
     *      string: community, collection, or item
     * @param context
     *      current context in which needing to load navigation.
     */
    loadNav(type, context): void {
        if(!context.loaded[type]) {
            if (!context.limit) {
                this.paging(context);
            }
            let cachedPage = this.pagingStore.getPage(type, context);
            if (cachedPage) {
                context[this.dspaceConstants[type].DSPACE] = cachedPage;
            }
            else {
                this.dspaceService['fetch' + this.dspaceConstants[type].COMPONENT](context).subscribe(nav => {
                    context[this.dspaceConstants[type].DSPACE] = this.prepare(context, nav);
                    this.pagingStore.addPage(type, context);
                    context.loaded[type] = true;
                },
                error => {
                    console.error('Error: ' + JSON.stringify(error, null, 4));
                },
                () => {
                    console.log('finished fetching ' + this.dspaceConstants[type].DSPACE + ' page ' + context.page + ' of ' + context.name);
                });
            }
        }
    }

    /**
     * Method to load context details. Calls prepare with the context received.
     *
     * @param type
     *      string: community, collection, or item
     * @param id
     *      current context id which needing to load context details
     * @param page
     *      current context page
     * @param limit
     *      current context limit
     */
    loadObj(type, id, page?, limit?): Promise<any> {
        // needed to be used within scope of promise
        let hierarchy = this;
        return new Promise(function (resolve, reject) {
            let parent;
            let useCachedContext = false;
            let hierarchyContext = hierarchy.find(type, id);
            if(hierarchyContext) {
                useCachedContext = true;
                if(type == 'item' && !hierarchyContext.fullItem) {
                    useCachedContext = false;
                }
            }
            if (useCachedContext) {
                parent = hierarchyContext.type == 'item' ? hierarchyContext.parentCollection : hierarchyContext.parentCommunity;
                hierarchy.paging(hierarchyContext, page, limit);
                hierarchy.prepare(parent, hierarchyContext);
                resolve(hierarchyContext);
            }
            else {
                hierarchy.dspaceService['fetch' + hierarchy.dspaceConstants[type].METHOD](id).subscribe(context => {
                    if(context.type == "item") {
                        parent = hierarchy.find(context.parentCollection.type, context.parentCollection.id);
                        if(parent) {
                            for(let item of parent.items) {
                                if(item.id == context.id) {
                                    for(let key in context) {
                                        if(ObjectUtil.isEmpty(item[key])) {
                                            item[key] = context[key];
                                        }
                                    }
                                    context = item;
                                    context.fullItem = true;
                                }
                            }
                        }
                        else {
                            console.log('item parent is not in hierarchy');
                        }
                    }
                    else {
                        if(context.parentCommunity) {
                            parent = hierarchy.find(context.parentCommunity.type, context.parentCommunity.id);
                            if(!parent) {
                                console.log('parent is not in hierarchy');
                            }
                        }
                    }
                    hierarchy.paging(context, page, limit);
                    hierarchy.prepare(parent, context);
                    context.ready = true;
                    resolve(context);
                },
                error => {
                    console.error('Error: ' + JSON.stringify(error, null, 4));
                },
                () => {
                    console.log('finished fetching ' + type + ' ' + id);
                });
            }
        });
    }

    /**
     * Method to find the context in the hierarchy.
     *
     * @param type
     *      string: community, collection, or item
     * @param id
     *      current context id which needing to load context details
     */
    find(type, id): any {
        return this.recursiveFind(this.hierarchy, type, id);
    }

    /**
     * Method to recursively search the hierarchy to find the context by type and id.
     *
     * @param hierarchy
     *      level of recursion in the hierarchy
     * @param type
     *      string: community, collection, or item
     * @param id
     *      current context id which needing to load context details
     */
    recursiveFind(hierarchy, type, id): any {
        for(let context of hierarchy) {
            if(context.type == type && context.id == id) {
                return context;
            }
            if(type == "item" && context.type == "collection") {
                let item = this.recursiveFind(context.items, type, id);
                if(item) {
                    return item;
                }
            }
            if(context.type == "community") {
                let collection = this.recursiveFind(context.collections, type, id);
                if(collection) {
                    return collection;
                }
            }
            if(context.type == "community") {
                let community = this.recursiveFind(context.subcommunities, type, id);
                if(community) {
                    return community;
                }
            }
        }
        return null;
    }

    /**
     * Method to apply pagination to context.
     *
     * @param context
     *      current context in which needing to apply pagination.
     * @param page *optional
     *      current page
     * @param limit *optional
     *      current limit
     */
    paging(context, page?, limit?): void {
        context.page = page ? page : 1;
         // TODO: remove ternary when pagination of communities and collections
        context.limit = limit ? limit : context.type == 'collection' ? this.paginationService.getDefaultLimit() : context.type == 'item' ? 0 : 200;
        context.offset = context.page > 1 ? (context.page - 1) * context.limit : 0;
        // REST API should return the number of subcommunities and number of collections for pagination.
        context.total = context.type == 'community' ? context.subcommunities.length + context.collections.length : context.numberItems;
        context.pageCount = Math.ceil(context.total / context.limit);
    }

    /**
     * Method to determine how to process.
     * Recursively calls prepare on arrays of the given object.
     *
     * @param context
     *      current context in which needing to process relations.
     * @param obj
     *     The context list: items, collections, subcommunities or the context itself.
     */
    prepare(context, obj): Array<any> {
        if (Array.isArray(obj))
            return this.process(context, obj);
        else {
            this.enhance(obj);
            if (obj.type == 'item') {
                return obj;
            }
            else if (obj.type == 'collection') {
                this.loadNav('item', obj);
            }
            else if (obj.type == 'community') {
                this.loadNav('collection', obj);
                this.loadNav('community', obj);
            }
            else {
                console.log('Object has no type!');
            }
            return obj;
        }
    }

    /**
     * Method to make relationships with provided context and
     * place expanded property and toggle methods on a given context
     * if not an item.
     * Sets the parent community or collection if applicable.
     *
     * @param context
     *      current context in which needing to process relations.
     * @param list
     *     The context list: items, collections, subcommunities or the context itself
     *
     */
    process(context, list): Array<any> {
        // needed to be used within scope of forEach
        let hierarchy = this;
        list.forEach(current => {
            if (context) {
                if (current.type == 'item') {
                    current.parentCollection = context;
                }
                else {
                    current.parentCommunity = context;
                }
            }
            hierarchy.enhance(current);
            if (current.type != 'item') {
                current.expanded = false;
                current.toggle = function () {
                    this.expanded = !this.expanded;
                    if (this.expanded) {
                        if (this.type == 'item') {
                            // any item content navigation loading
                        }
                        else if (this.type == 'collection') {
                            hierarchy.loadNav('item', this);
                        }
                        else {
                            hierarchy.loadNav('community', this);
                            hierarchy.loadNav('collection', this);
                        }
                    }
                }
            }
        });
        return list;
    }

    /**
     * Adds component to the context and flag for fullItem if type equal item.
     *
     * @param context
     *      current context.
     */
    enhance(context): void {
        if(context.type == 'item' && !context.fullItem) {
            context.fullItem = false;
        }
        context.component = "/" + this.dspaceConstants[context.type].COMPONENT;
    }

}
