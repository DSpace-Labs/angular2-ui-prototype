import {EventEmitter, Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import {DSpaceService} from './dspace.service';

@Injectable()
export class DSpaceDirectory {

    store: {
        directory: {
            context: Object,
            observer: Observer<Object>,
            loader: Function,
            loading: boolean,
            ready: boolean
        },
        item: {
            context: Object,
            observer: Observer<Object>,
            loader: Function,
            loading: boolean,
            ready: boolean
        },
        collection: {
            context: Object,
            observer: Observer<Object>,
            loader: Function,
            loading: boolean,
            ready: boolean
        },
        community: {
            context: Object,
            observer: Observer<Object>,
            loader: Function,
            loading: boolean,
            ready: boolean
        }
    };

    directory: Observable<Object>;

    item: Observable<Object>;
    collection: Observable<Object>;
    community: Observable<Object>;

    emitter: EventEmitter<Object>;

    constructor(private dspaceService: DSpaceService) {
        this.store = {
            directory: {
                context: new Array<Object>(),
                observer: null,
                loader: this.loadDirectory,
                loading: false,
                ready: false
            },
            community: {
                context: new Array<Object>(),
                observer: null,
                loader: this.loadDirectory,
                loading: false,
                ready: false
            },
            collection: {
                context: new Array<Object>(),
                observer: null,
                loader: this.loadDirectory,
                loading: false,
                ready: false
            },
            item: {
                context: {},
                observer: null,
                loader: this.loadDirectory,
                loading: false,
                ready: false
            }
        };
        this.directory = new Observable<Object>(observer => this.store.directory.observer = observer).share();

        this.item = new Observable<Object>(observer => this.store.item.observer = observer).share();
        this.collection = new Observable<Object>(observer => this.store.collection.observer = observer).share();
        this.community = new Observable<Object>(observer => this.store.community.observer = observer).share();

        this.emitter = new EventEmitter<Object>();
    }

    refreshDirectory() {
        this.directory = Observable.create(observer => {
            this.store.directory.observer = observer;
            this.store.directory.observer.next(this.store.directory.context);
        });
    }

    loadDirectory() {
        if (this.store.directory.ready) {
            this.refreshDirectory();
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
    
    loadSubCommunities(context) {
        if (context.ready) { }
        else {
            this.dspaceService.fetchCommunitySubCommunities(context.id).subscribe(subcommunities => {
                context.subcommunities = this.prepare(context, subcommunities);
                context.ready = true;
            },
            error => {
                console.error('Error: ' + JSON.stringify(error, null, 4));
            },
            () => {
                console.log('finished fetching subcommunities of ' + context.name);
            });
        }
    }

    loadCollections(context) {
        if (context.ready) { }
        else {
            this.dspaceService.fetchCommunityCollections(context.id).subscribe(collections => {
                context.collections = this.prepare(context, collections);
                context.ready = true;
            },
            error => {
                console.error('Error: ' + JSON.stringify(error, null, 4));
            },
            () => {
                console.log('finished fetching collections of ' + context.name);
            });
        }
    }

    loadItems(context) {
        if (context.ready) { }
        else {
            this.dspaceService.fetchItems(context.id).subscribe(items => {
                context.items = this.prepare(context, items);
                context.ready = true;
            },
                error => {
                    console.error('Error: ' + JSON.stringify(error, null, 4));
                },
                () => {
                    console.log('finished fetching items of ' + context.name);
                });
        }
    }

    // TODO: put in and retrieve from directory
    loadCommunity(id) {
        this.dspaceService.fetchCommunity(id).subscribe(community => {
            this.store.community.context = this.prepare(null, community);
            this.store.community.observer.next(this.store.community.context);
        },
            error => {
                console.error('Error: ' + JSON.stringify(error, null, 4));
            },
            () => {
                this.store.community.ready = true;
                this.store.community.loading = false;
                console.log('finished fetching community ' + id);
            });
    }

    // TODO: put in and retrieve from directory
    loadCollection(id) {
        this.dspaceService.fetchCollection(id).subscribe(collection => {
            this.store.collection.context = this.prepare(null, collection);
            this.store.collection.observer.next(this.store.collection.context);
        },
            error => {
                console.error('Error: ' + JSON.stringify(error, null, 4));
            },
            () => {
                this.store.collection.ready = true;
                this.store.collection.loading = false;
                console.log('finished fetching collection ' + id);
            });
    }

    // TODO: put in and retrieve from directory
    loadItem(id) {
        this.dspaceService.fetchItem(id).subscribe(item => {
            this.store.item.context = this.prepare(null, item);
            this.store.item.observer.next(this.store.item.context);
        },
            error => {
                console.error('Error: ' + JSON.stringify(error, null, 4));
            },
            () => {
                this.store.item.ready = true;
                this.store.item.loading = false;
                console.log('finished fetching item ' + id);
            });
    }

    prepare(context, obj) {

        let directory = this;

        if (Object.prototype.toString.call(obj) !== '[object Array]') {
            if (obj.type == 'item') {
                return obj;
            }
            if (obj.type == 'collection') {
                obj.list = obj.items;
            }
            if (obj.type == 'community') {
                obj.list = obj.collections.concat(obj.subcommunities);
            }
        }
        else {
            obj.list = obj;
        }

        obj.list.forEach(current => {
            if (context) {
                if (current.type != 'item') {
                    current.parentCommunity = context;
                }
            }
            current.ready = false;
            current.path = this.getPath(current.type);
            current.component = this.getComponent(current.type);

            if (current.type != 'item') {
                current.expanded = false;
                current.toggle = function () {
                    this.expanded = !this.expanded;
                    if (this.expanded) {
                        directory.loadSubCommunities(this);
                        directory.loadCollections(this);
                        if (this.type == 'collection') {
                            directory.loadItems(this);
                        }
                    }
                }
            }

        });

        return obj;
    }
    
    getPath(type) {
        switch (type) {
            case 'community': return '/Communities';
            case 'collection': return '/Collections';
            case 'item': return '/Items';
            default: { }
        }
    }

    getComponent(type) {
        switch (type) {
            case 'community': return 'Communities';
            case 'collection': return 'Collections';
            case 'item': return 'Items';
            default: { }
        }
    }

}
