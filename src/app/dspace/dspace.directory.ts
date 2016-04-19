import {EventEmitter, Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';

import {DSpaceService} from './dspace.service';
import {DSpaceStore} from './dspace.store';
import {DSpaceConstants} from './dspace.constants';

import {PaginationService} from '../navigation/pagination.service';

/**
 * Injectable service to provide navigation and context. Provides
 * session caching to eliminate requesting content already received.
 *
 * TODO: Create caching service which leverages local storage.
 *
 * The idea is to cache the directory and store in localStorage to
 * have immediate response when navigating and visiting context which has
 * been visited before. Would require synchronization to keep up to date.
 * Could also leverage webworkers to populate cache of unvisited context.
 */
@Injectable()
export class DSpaceDirectory {

    /**
     * Object to represent visited portions of the index hierarchy.
     */
    private store: {
        directory: {
            context: Object,
            observer: Observer<Object>,
            loading: boolean,
            ready: boolean
        }
    };

    /**
     * An Observable to perform binding to the components.
     */
    directory: Observable<Object>;

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
        this.store = {
            directory: {
                context: new Array<Object>(),
                observer: null,
                loading: false,
                ready: false
            }
        };
        this.directory = new Observable<Object>(observer => this.store.directory.observer = observer).share();        
    }

    /**
     * Method to perform initial loading of the directory.
     * Calls prepare with the top community results.
     */
    loadDirectory() {
        if (this.store.directory.ready) {
            this.directory = Observable.create(observer => {
                this.store.directory.observer = observer;
                this.store.directory.observer.next(this.store.directory.context);
            });
        }
        else {
            if (!this.store.directory.loading) {
                this.store.directory.loading = true;
                this.dspaceService.fetchTopCommunities().subscribe(topCommunities => {
                    this.store.directory.context = this.prepare(null, topCommunities);
                    this.store.directory.observer.next(this.store.directory.context);
                },
                error => {
                    console.error('Error: ' + JSON.stringify(error, null, 4));
                },
                () => {
                    this.store.directory.ready = true;
                    this.store.directory.loading = false;
                    console.log('finished fetching top communities');
                });
            }
        }
    }

    /**
     * Method to load hierarchy navigation relations.
     * Calls prepare with the context received.
     *
     * @param type
     *      string: community, collection, or item
     * @param context
     *      current context in which needing to load navigation.
     */
    loadNav(type, context) {
        if (!context.limit) {
            this.setup(context);
        }
        let cachedPage = this.dspaceStore.getPage(context);
        if (cachedPage) {
            context[this.dspaceConstants[type].DSPACE] = cachedPage;
        }
        else {
            this.dspaceService['fetch' + this.dspaceConstants[type].COMPONENT](context).subscribe(nav => {
                context[this.dspaceConstants[type].DSPACE] = this.prepare(context, nav);
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
     * Load the recent items. Optionally, load recent items of a certain collection.
     * @param type
     * @param origin
     * @param collectionid
     * @param limit
     * @returns {any|Promise}
     */
    loadRecentItems(type,origin,collectionid,limit)
    {
        let directory = this;
        return new Promise(function (resolve,reject)
        {
             directory.dspaceService['fetch' + directory.dspaceConstants[type].METHOD](origin,collectionid,limit).subscribe(context => {
                    directory.setup(context);
                    directory.page(context, 0);
                    directory.prepare(null, context);
                    resolve(context);
                },
                    error => {
                    console.error('Error: ' + JSON.stringify(error, null, 4));
                },
                () => {
                    console.log('finished fetching something');
                });


        });
    }

    /**
     * Method to load context details.
     * Calls prepare with the context received.
     *
     * @param type
     *      string: community, collection, or item
     * @param id
     *      current context id which needing to load context details.
     */
    loadObj(type, id, page) {
        // needed to be used within scope of promise
        let directory = this;
        return new Promise(function (resolve, reject) {
            let context;
            if ((context = directory.dspaceStore.get(directory.dspaceConstants[type].PLURAL, id))) {
                directory.page(context, page);
                directory.prepare(null, context);
                resolve(context);
            }
            else {
                directory.dspaceService['fetch' + directory.dspaceConstants[type].METHOD](id).subscribe(context => {
                    directory.setup(context);
                    directory.page(context, page);
                    directory.prepare(null, context);
                    directory.dspaceStore.add(directory.dspaceConstants[type].PLURAL, context);
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
     * Method to setup context for pagination.
     *
     * @param context
     *      current context in which needing to load navigation with pagination.
     */
    setup(context) {
        context.offset = 0;
        // TODO: remove ternary when pagination of communities and collections
        context.limit = context.type == 'collection' ? this.paginationService.getDefaultLimit() : 200;
        // REST API should return the number of subcommunities and number of collections!!!
        // Currently, the subcommunities and collections are retrieved with the expand when fetching a community.
        context.total = context.type == 'community' ? context.subcommunities.length + context.collections.length : context.numberItems;
        context.pageCount = Math.ceil(context.total / context.limit);
        context.page = 1;
    }
    
    /**
     * Method to apply pagination to context.
     *
     * @param context
     *      current context in which needing to apply pagination.
     * @param page
     *      current page
     */
    page(context, page) {
        context.page = page;
        context.offset = context.page > 1 ? (context.page - 1) * context.limit : 0;
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
                // TODO: change here may be required when pagination of communities and collections 
                this.prepare(context, obj.collections);
                this.prepare(context, obj.subcommunities);
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
     * Adds properties to the object.
     *
     * @param context
     *      current context.
     */
    enhance(context) {
        context.component = this.dspaceConstants[context.type].COMPONENT;
    }
    
}
