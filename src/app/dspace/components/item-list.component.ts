import { Component, Input } from 'angular2/core';
import { RouteParams } from 'angular2/router';

import { DSpaceDirectory } from '../dspace.directory';
import { DSpaceService } from '../services/dspace.service';

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
    template: `
                <!-- for each item, we create an item-list-entry element -->
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

}