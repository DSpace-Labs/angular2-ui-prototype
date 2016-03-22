import {EventEmitter, Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import {DSpaceService} from './dspace.service';

@Injectable()
export class DSpaceDirectory {

    store: {
        directory: {
            context: Object[],
            observer: Observer<Object[]>,
            loader: Function,
            loading: boolean,
            ready: boolean
        }
    };

    directory: Observable<Object[]>;

    constructor(private dSpaceService: DSpaceService) {
        this.store = {
            directory: {
                context: new Array<Object>(),
                observer: null,
                loader: this.loadDirectory,
                loading: false,
                ready: false
            }
        };
        this.directory = new Observable<Object[]>(observer => this.store.directory.observer = observer).share();
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
                this.dSpaceService.fetchTopCommunities().subscribe(topCommunities => {
                    this.store.directory.context = topCommunities;
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

    addToDirectory() {

    }

}
