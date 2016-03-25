import {EventEmitter, Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import {DSpaceService} from './dspace.service';

@Injectable()
export class DSpaceCollections {

    store: {
        collections: {
            context: Object[],
            observer: Observer<Object[]>,
            loader: Function,
            loading: boolean,
            ready: boolean
        }
    };

    collections: Observable<Object[]>;

    constructor(private dSpaceService: DSpaceService) {
        this.store = {
            collections: {
                context: new Array<Object>(),
                observer: null,
                loader: this.loadCollection,
                loading: false,
                ready: false
            }
        };
        this.collections = new Observable<Object[]>(observer => this.store.collections.observer = observer).share();
    }

    ngOnInit() {
        console.log(this.store);
    }

    loadCollections() {

    }

    loadCollection(id) {

    }
    
}
