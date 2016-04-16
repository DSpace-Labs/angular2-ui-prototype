import {EventEmitter, Injectable} from 'angular2/core';

import {DSpaceService} from './dspace.service';
import {DSpaceStore} from './dspace.store';
import {DSpaceConstants} from './dspace.constants';

import {PaginationService} from '../navigation/pagination.service';

import {ObjectUtil} from '../utilities/commons/object.util'

/**
 * Injectable service to provide navigation and context.
 */
@Injectable()
export class DSpaceDirectory {

    public directory: Array<Object>;

    private loading: boolean;

    private ready: boolean;

    /**
     * 
     * @param dspaceService 
     *      DSpaceService is a singleton service to interact with the dspace REST API.
     * @param dspaceStore 
     *      DSpaceStore is a singleton service to cache context which have already been requested.
     * @param dspaceConstants
     *      DSpaceConstants is a singleton service with constants.
     * @param paginationService 
     *      PaginationService is a singleton service for pagination controls.
     */
    constructor(private dspaceService: DSpaceService,
                private dspaceStore: DSpaceStore,
                private dspaceConstants: DSpaceConstants,
                private paginationService: PaginationService) {
        this.directory = new Array<Object>();
        this.loading = false;
        this.ready = false;
    }

    /**
     * Method to perform initial loading of the directory.
     * Calls prepare with the top community results.
     */
    loadDirectory() {
        if (!this.ready) {
            if (!this.loading) {
                this.loading = true;
                this.dspaceService.fetchTopCommunities().subscribe(topCommunities => {
                    this.directory = this.prepare(null, topCommunities);
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
    loadNav(type, context) {
        if(context.loaded) return;
        if (!context.limit) {
            this.paging(context);
        }
        let cachedPage = this.dspaceStore.getPage(context);
        if (cachedPage) context[this.dspaceConstants[type].DSPACE] = cachedPage;
        else {
            this.dspaceService['fetch' + this.dspaceConstants[type].COMPONENT](context).subscribe(nav => {
                context[this.dspaceConstants[type].DSPACE] = this.prepare(context, nav);
                context.loaded = true;
                this.dspaceStore.addPage(context);
            },
            error => {
                console.error('Error: ' + JSON.stringify(error, null, 4));
            },
            () => {
                console.log('finished fetching ' + this.dspaceConstants[type].DSPACE + ' page ' + context.page + ' of ' + context.name);
            });
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
    loadObj(type, id, page?, limit?) {
        // needed to be used within scope of promise
        let directory = this;
        return new Promise(function (resolve, reject) {
            let parent;
            let useCachedContext = false;
            let directoryContext = directory.find(type, id);
            if(directoryContext) {
                useCachedContext = true;
                if(type == 'item' && !directoryContext.fullItem) {
                    useCachedContext = false;
                }
            }
            if (useCachedContext) {
                parent = directoryContext.type == 'item' ? directoryContext.parentCollection : directoryContext.parentCommunity;
                directory.paging(directoryContext, page, limit);
                directory.prepare(parent, directoryContext);
                resolve(directoryContext);
            }
            else {
                directory.dspaceService['fetch' + directory.dspaceConstants[type].METHOD](id).subscribe(context => {
                    if(context.type == "item") {
                        parent = directory.find(context.parentCollection.type, context.parentCollection.id);
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
                            console.log('item parent is not in directory');
                        }
                    }
                    else {
                        if(context.parentCommunity) {
                            parent = directory.find(context.parentCommunity.type, context.parentCommunity.id);
                            if(!parent) {
                                console.log('parent is not in directory');
                            }
                        }
                    }
                    directory.paging(context, page, limit);
                    directory.prepare(parent, context);
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
     * Method to find the contex in the directory.
     *
     * @param type
     *      string: community, collection, or item
     * @param id
     *      current context id which needing to load context details
     */
    find(type, id) {
        return this.recursiveFind(this.directory, type, id);
    }

    /**
     * Method to recursively search the directory to find the contex by type and id.
     *
     * @param directory
     *      level of recursion in the directory
     * @param type
     *      string: community, collection, or item
     * @param id
     *      current context id which needing to load context details
     */
    recursiveFind(directory, type, id) {
        for(let context of directory) {
            if(context.type == type && context.id == id) {
                return context;
            }
            if(type == "item" && context.type == "collection") {
                let item = this.recursiveFind(context.items, type, id);
                if(item) return item;
            }
            if(context.type == "community") {
                let collection = this.recursiveFind(context.collections, type, id);
                if(collection) return collection;
            }
            if(context.type == "community") {
                let community = this.recursiveFind(context.subcommunities, type, id);
                if(community) return community;
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
    paging(context, page?, limit?) {
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
    prepare(context, obj) {
        if (Array.isArray(obj)) 
            return this.process(context, obj);
        else {
            this.enhance(obj);
            if (obj.type == 'item')
                return obj;
            else if (obj.type == 'collection')
                this.loadNav('item', obj);
            else if (obj.type == 'community') {
                this.loadNav('collection', obj);
                this.loadNav('community', obj);
            }
            else console.log('Object has no type!');
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
    process(context, list) {
        // needed to be used within scope of forEach
        let directory = this;
        list.forEach(current => {
            if (context) {
                if (current.type == 'item')
                    current.parentCollection = context;
                else
                    current.parentCommunity = context;
            }
            directory.enhance(current);
            if (current.type != 'item') {
                current.expanded = false;
                current.toggle = function () {
                    this.expanded = !this.expanded;
                    if (this.expanded) {
                        if (this.type == 'item') {
                            // any item content navigation loading
                        }
                        else if (this.type == 'collection') {
                            directory.loadNav('item', this);
                        }
                        else {
                            directory.loadNav('community', this);
                            directory.loadNav('collection', this);
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
    enhance(context) {
        if(context.type == 'item' && !context.fullItem) {
            context.fullItem = false;
        }
        context.component = "/" + this.dspaceConstants[context.type].COMPONENT;
    }
    
}
