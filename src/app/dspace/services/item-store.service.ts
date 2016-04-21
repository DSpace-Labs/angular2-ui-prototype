import {Injectable, Inject} from 'angular2/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {Item} from "../models/item.model";

/**
 * Class to store the current item a user is viewing. So we can use this when routing.
 */
@Injectable()
export class ItemStoreService {

    private _item: Item;

    private itemSubject : Subject<Item>;

    itemObservable: Observable<Item>;

    constructor() {
        this.item = null;
        this.itemSubject = new Subject<Item>();
        this.itemObservable = this.itemSubject.asObservable();
    }

    change(currentItem) {
        this.item = currentItem;
        this.itemSubject.next(currentItem);
    }

    get item(): Item {
        return this._item;
    }

    set item(item: Item) {
        this._item = item;
    }

}
