import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";


import {ListEntryComponent} from './item/list/list-entry.component';

/**
 * Need to think of a way in which I can manage showing either 'all items' or 'most recent items', depending on the location where this item is inserted.
 */
@Component({
    selector: 'item-list',
    directives: [ListEntryComponent],
    template:
        `
        <h4>Item list..</h4> <!-- we could pass this as a title, and say on the dashboard 'most recent items of x' and on a collection 'most recent items of y' -->
            <!-- for each item, we create an item-list-entry element -->

                <div id="list-entries" class="row">
                    <list-entry></list-entry>
                </div>

        `
})

export class ItemListComponent {

    constructor()
    {
    }



}