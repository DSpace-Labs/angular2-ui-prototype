import { Component, Input } from '@angular/core';
import { TranslatePipe } from "ng2-translate/ng2-translate";

import { ListEntryComponent } from './item/list/list-entry.component';
import { Item } from '../models/item.model';
import { Collection } from '../models/collection.model';
import { PaginationComponent } from '../../navigation/components/pagination.component';

/**
 * Renders a row of the item list.
 * Right now we just pass a colection, but to be used from another component (in the future), you could pass it items directly.
 */
@Component({
    selector: 'item-list',
    directives: [ ListEntryComponent, PaginationComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <!-- for each item, we create an item-list-entry element -->
                <h2 *ngIf="header" class="item-component-header">{{ header | translate }}</h2>
                <div *ngFor="let item of items" id="list-entries" class="row item-list-row">
                    <list-entry [item]="item"></list-entry>
                </div>
                <pagination [context]="collection"></pagination>
              `
})
export class ItemListComponent {

    /**
     *
     */
    @Input() private collection: Collection;

    /**
     * Pass an array of items to this component.
     */
    @Input() private items: Array<Item>;


    /**
     * Contains the i18n string to set the title
     * The string needs to match one in en.json
     * @type {string}
     */
    @Input() private header : string;
}
