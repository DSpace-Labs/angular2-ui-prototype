import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"

import {TruncatePipe} from "../../../utilities/pipes/truncate.pipe"

/**
 * Component for the collections of the simple-item-view.
 * When you click on the collection name, it has to redirect to the right collection.
 */
@Component({
    selector: 'item-collection',
    inputs: ['itemData'],
    pipes: [TruncatePipe],
    template:
        `<div id="item-collection">
            <h3>collections</h3>
            <a [attr.href]="itemData.parentCollection.id">{{ itemData.parentCollection.name }}</a> <!-- need to alter the href so it redirects correctly -->
         </div>
            `
})

export class CollectionComponent {

    public itemData : Object;
    fields : String[]; // the fields that we want to show on this page.

    filteredFields; // the values that we will filter out of the metadata.

    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {
        console.log("setting up the collection component");
    }

    ngOnInit()
    {

    }

}

