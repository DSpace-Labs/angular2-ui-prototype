import {EventEmitter, Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';

import {DSpaceService} from './dspace.service';
import {DSpaceStore} from './dspace.store';
import {DSpaceKeys} from './dspace.keys';

@Injectable()
export class DSpaceDirectory {

    private store: {
        directory: {
            context: Object,
            observer: Observer<Object>,
            loading: boolean,
            ready: boolean
        }
    };

    directory: Observable<Object>;

    constructor(private dspaceService: DSpaceService,
                private dspaceStore: DSpaceStore,
                private dspaceKeys: DSpaceKeys) {
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

    loadNav(type, context) {
        if (context.ready) {
            console.log('already ready')
        }
        else {
            this.dspaceService['fetch' + this.dspaceKeys[type].COMPONENT](context.id).subscribe(nav => {
                context[this.dspaceKeys[type].DSPACE] = this.prepare(context, nav);
                context.ready = true;
            },
            error => {
                console.error('Error: ' + JSON.stringify(error, null, 4));
            },
            () => {
                console.log('finished fetching ' + this.dspaceKeys[type].DSPACE + ' of ' + context.name);
            });
        }
    }

    loadObj(type, id) {
        let directory = this;
        return new Promise(function (resolve, reject) {
            let obj;
            if ((obj = directory.dspaceStore.get(directory.dspaceKeys[type].PLURAL, id))) {
                resolve(obj);
            }
            else {
                directory.dspaceService['fetch' + directory.dspaceKeys[type].METHOD](id).subscribe(obj => {
                    obj = directory.prepare(null, obj);
                    obj.ready = true;
                    directory.dspaceStore.add(directory.dspaceKeys[type].PLURAL, obj);
                    resolve(obj);
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

    prepare(context, obj) {
        if (Object.prototype.toString.call(obj) !== '[object Array]') {
            this.enhance(obj);
            if (obj.type == 'item')
                return obj;
            else if (obj.type == 'collection')
                obj.list = obj.items;
            else if (obj.type == 'community')
                obj.list = obj.collections.concat(obj.subcommunities);
            else console.log('Object has no type!')
            this.process(context, obj.list);
            return obj;
        }
        return this.process(context, obj);
    }

    process(context, list) {
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
                        if (this.type == 'collection')
                            directory.loadNav('item', this);
                        else {
                            directory.loadNav('collection', this);
                            directory.loadNav('community', this);
                        }
                    }
                }
            }
        });
        return list;
    }

    enhance(obj) {
        obj.ready = false;
        obj.component = this.dspaceKeys[obj.type].COMPONENT;
    }
    
}
