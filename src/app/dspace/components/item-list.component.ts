import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';
import {DSpaceService} from '../services/dspace.service';

import {ListEntryComponent} from './item/list/list-entry.component';
import {Item} from '../models/item.model';
import {Collection} from '../models/collection.model';
import {PaginationComponent} from '../../navigation/components/pagination.component';

/**
 * Renders a row of the item list.
 * Right now we just pass a colection, but to be used from another component (in the future), you could pass it items directly.
 */
@Component({
    selector: 'item-list',
    directives: [ListEntryComponent, PaginationComponent],
    inputs: ['items', 'collection'],
    template:
        `
            <div *ngFor="let item of items" id="list-entries" class="row item-list-row">  <!-- for each item, we create an item-list-entry element -->
                <list-entry [item]="item"></list-entry>
            </div>

            <pagination [context]="collection"></pagination>
        `
})
export class ItemListComponent {

    /**
     *
     */
    collection : Collection;

    /**
     *
     */
    items : Item[]; // pass an array of items to this component.

}