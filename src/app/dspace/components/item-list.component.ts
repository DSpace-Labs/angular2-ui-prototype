import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';
import {DSpaceService} from '../dspace.service';

import {ListEntryComponent} from './item/list/list-entry.component';
import {Item} from '../models/item.model';

/**
 * Renders a row of the item list.
 */
@Component({
    selector: 'item-list',
    directives: [ListEntryComponent],
    inputs: ['items'],
    template:
        `
            <div *ngFor="#item of itemsWithInformation" id="list-entries" class="row">  <!-- for each item, we create an item-list-entry element -->
                <list-entry [item]="item"></list-entry>
            </div>
        `
})



export class ItemListComponent {

    items : Item[]; // pass an array of items to this component.
    itemsWithInformation : Item[] = [];
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