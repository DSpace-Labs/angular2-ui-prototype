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
 */
@Component({
    selector: 'item-list',
    directives: [ListEntryComponent],
    inputs: ['items', 'collection'],
    template:
        `
            <h1>Test</h1>
            <div *ngFor="#item of itemsWithInformation" id="list-entries" class="row">  <!-- for each item, we create an item-list-entry element -->
                <list-entry [item]="item"></list-entry>
            </div>
        `
})



export class ItemListComponent {

    collection : Collection;
    items : Item[]; // pass an array of items to this component.
    itemsWithInformation : Item[] = []; // Loaded the metadata of the item and storing them here.
    constructor(private directory: DSpaceDirectory)
    {
    }

    ngOnChanges()
    {
        if(this.items != null && this.items.length > 0)
        {
            this.items.forEach( (entry) => {
                this.directory.loadObj('item', entry.id,0).then((item:Item) => {
                    this.itemsWithInformation.push(item);
                });
            })

        }
    }



}