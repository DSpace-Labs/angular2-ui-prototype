import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"

/**
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 * This can optionally be rendered in the simple-item-view.
 */

@Component({
    selector: 'item-metadata',
    inputs: ['itemData'],
    template:
        `<div id="metadata">
                    <h3>Metadata</h3>
                        <div *ngFor="#metadatum of filteredFields.metadata; #index = index" class="item">
                                <strong >{{ metadatum.key }}</strong>
                                <p>{{ metadatum.value }}</p>
                        </div>

             </div>
            `
})

export class MetadataComponent {

    /**
     * TODO: replace object with inheritance model. e.g. item extends dspaceObject
     */

    item: Object;
    public itemData : Object;
    fields : String[]; // the fields that we want to show on this page.

    filteredFields; // the values that we will filter out of the metadata.

    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {
        this.fields = ["dc.contributor.author","dc.date.accessioned","dc.date.available",
                        "dc.date.issued","dc.identifier.uri","dc.rights","dc.rights.uri","dc.subject","dc.title","dc.type"];
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

