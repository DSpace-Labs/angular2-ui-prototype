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
    directives: [ListEntryComponent, PaginationComponent],
    inputs: ['items', 'collection'],
    template:
        `
            <div *ngFor="#item of itemsWithInformation" id="list-entries" class="row item-list-row">  <!-- for each item, we create an item-list-entry element -->
                <list-entry [item]="item"></list-entry>
            </div>

            <pagination [context]="collection"></pagination>
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
        if(this.collection != null)
        {
            // map the component to these items.
            // we need to load extra metadata of all these items, because we want to show more than what the dspace API returns by default
            console.log("in the collection");
            console.log(this.collection.items);
            setTimeout( () => console.log(this.collection.items),10000);
            this.collection.items.forEach( (entry) =>
            {
                console.log("for each item");
                this.directory.loadObj('item',entry.id,0).then( (item:Item) =>
                {
                    console.log("loaded information");
                    this.itemsWithInformation.push(item);
                });
            });
        }
    }


}