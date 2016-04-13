import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {MetadataHelper} from '../../../utilities/metadata.helper';

import {Metadatum} from '../../models/metadatum.model'


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
                        <div *ngFor="#metadatum of filteredFields;">
                                <p>{{ metadatum.value }}</p>
                        </div>

             </div>
            `
})

export class AuthorsComponent {

    private itemData : Metadatum[];
    private fields : String[]; // the fields that we want to show on this page.
    private filteredFields : Metadatum[]; // the values that we will filter out of the metadata.

    constructor(private params: RouteParams,private directory: DSpaceDirectory, translate : TranslateService)
    {
        translate.setDefaultLang('en');
        translate.use('en');
        this.fields = ["dc.contributor.author","dc.creator","dc.contributor"];
    }

    ngOnInit()
    {
        this.filterMetadata();
    }

    private filterMetadata()
    {
        let metadataHelper = new MetadataHelper();
        this.filteredFields = metadataHelper.filterMetadata(this.itemData,this.fields);
    }

}

