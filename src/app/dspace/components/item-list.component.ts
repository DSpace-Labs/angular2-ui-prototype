import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';
import {DSpaceService} from '../dspace.service';

import {ListEntryComponent} from './item/list/list-entry.component';
import {Item} from '../models/item.model';

/**
 * Need to think of a way in which I can manage showing either 'all items' or 'most recent items', depending on the location where this item is inserted.
 */
@Component({
    selector: 'item-list',
    directives: [ListEntryComponent],
    inputs: ['items'],
    template:
        `
        <h4>Item list..</h4> <!-- we could pass this as a title, and say on the dashboard 'most recent items of x' and on a collection 'most recent items of y' -->
            <!-- for each item, we create an item-list-entry element -->

                <div *ngFor="#items of items" id="list-entries" class="row">
                    <list-entry></list-entry>
                </div>

        `
})


/**
 * We can accept the incomming JSON form a higher component for the time being.
 * But this class will create and Object (Item) out of it, which will be used in the child components.
 * Similar approach to 'simple & full item-view'
 */
export class ItemListComponent {

    items : Item[];

    constructor(private directory: DSpaceDirectory)
    {

    }

    ngOnInit()
    {
        console.log("in the item list..");
        console.log(this.items);
    }

    ngOnChanges()
    {
        console.log("something changes, clearly.");
        console.log(this.items);
        // process this items.

        if(this.items.length > 0)
        {
            console.log("aqui!");
            // now we need to load more information about these items.
                this.directory.loadObj('item', 2489,0).then(item => { // passing on '0' to avoid TS errors, but we don't actually *need* it for items.
                console.log(item);
                console.log("the directory has loaded.. jesus finally :-)");
            });
        }
    }



}