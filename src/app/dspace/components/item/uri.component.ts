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
    selector: 'item-uri',
    inputs: ['itemData'],
    pipes: [TruncatePipe],
    template:
        `<div id="uri">
                    <h3>uri</h3>
                        <div *ngFor="#metadatum of filteredFields.metadata; #index = index">
                     <!--           <p>{{ metadatum.key }}</p> -->
                                <a [attr.href]="metadatum.value">{{ metadatum.value}}</a>
                        </div>

             </div>
            `
})

export class UriComponent {

    /**
     * TODO: replace object with inheritance model. e.g. item extends dspaceObject
     */

    item: Object;
    public itemData : Object;
    fields : String[]; // the fields that we want to show on this page.

    filteredFields; // the values that we will filter out of the metadata.

    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {
        this.fields = ["dc.identifier.uri"];
        console.log("setting up the uri component");
    }

    ngOnInit()
    {
        var itemModel = new Item();
        this.filteredFields = itemModel.filterMetadata(this.fields,this.itemData);
    }

}

