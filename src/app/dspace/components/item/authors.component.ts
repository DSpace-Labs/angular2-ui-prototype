import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";


/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */

@Component({
    selector: 'item-authors',
    inputs: ['itemData'],
    pipes: [TranslatePipe],
    template:
            `<div id="authors">
                    <h3>{{'item-view.authors.title' | translate}}</h3>
                        <div *ngFor="#metadatum of filteredFields.metadata;">
                                <p>{{ metadatum.value }}</p>
                        </div>

             </div>
            `
})

export class AuthorsComponent {

    /**
     * TODO: replace object with inheritance model. e.g. item extends dspaceObject
     */

    item: Object;
    public itemData : Object;
    fields : String[]; // the fields that we want to show on this page.

    filteredFields; // the values that we will filter out of the metadata.

    constructor(private params: RouteParams,private directory: DSpaceDirectory, translate : TranslateService)
    {
        translate.setDefaultLang('en');
        translate.use('en');
        this.fields = ["dc.contributor.author","dc.creator","dc.contributor"];
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

