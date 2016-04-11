import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"

import {TruncatePipe} from "../../../utilities/pipes/truncate.pipe"

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */

@Component({
    selector: 'item-date',
    inputs: ['itemData'],
    pipes: [TruncatePipe],
    template:
        `<div id="date">
                    <h3>date</h3>
                        <div *ngFor="#metadatum of filteredFields.metadata; #index = index">
                     <!--           <p>{{ metadatum.key }}</p> -->
                                <p>{{ metadatum.value | truncate}}</p>
                        </div>

             </div>
            `
})

export class DateComponent {

    /**
     * TODO: replace object with inheritance model. e.g. item extends dspaceObject
     */

    item: Object;
    public itemData : Object;
    fields : String[]; // the fields that we want to show on this page.

    filteredFields; // the values that we will filter out of the metadata.

    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {
        this.fields = ["dc.date.accessioned"];
        console.log("setting up the date component");
    }

    ngOnInit()
    {
        var itemModel = new Item();
        this.filteredFields = itemModel.filterMetadata(this.fields,this.itemData);
        // let's see what we got back here.
        console.log(this.filteredFields);
        console.log("stringify: " + JSON.stringify(this.filteredFields));
    }

}

