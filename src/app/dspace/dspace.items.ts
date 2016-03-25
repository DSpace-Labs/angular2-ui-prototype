import {EventEmitter, Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import {DSpaceService} from './dspace.service';

@Injectable()
export class DSpaceItems {

    store: {
        items: {
            context: Object,
            observer: Observer<Object>,
            loader: Function,
            loading: boolean,
            ready: boolean
        }
    };

    items: Observable<Object>;

    constructor(private dSpaceService: DSpaceService) {
        this.store = {
            items: {
                context: new Object(),
                observer: null,
                loader: this.loadItem,
                loading: false,
                ready: false
            }
        };
        this.items = new Observable(observer => this.store.items.observer = observer).share();
    }

    ngOnInit() {
        console.log(this.store);
    }

    loadItems() {

    }

    loadItem(id) {

    }

}
