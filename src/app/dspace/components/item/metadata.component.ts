import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {MetadataHelper} from '../../../utilities/metadata.helper';

import {Metadatum} from '../../models/metadatum.model'

import {ComponentTitleComponent} from './component-title.component';

/**
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 * This can optionally be rendered in the simple-item-view.
 */
@Component({
    selector: 'item-metadata',
    inputs: ['itemData'],
    directives: [ComponentTitleComponent],
    pipes: [TranslatePipe],
    template:
        `<div id="metadata">
            <component-title [title]="component_title"></component-title>
            <div *ngFor="#metadatum of filteredFields.metadata;" class="item">
                <strong >{{ metadatum.key }}</strong>
                <p>{{ metadatum.value }}</p>
            </div>
         </div>
            `
})

export class MetadataComponent {

    private component_title = "item-view.metadata.title";
    private itemData : Metadatum[];
    private fields : String[]; // the fields that we want to show on this page.
    private filteredFields : Metadatum[]; // the values that we will filter out of the metadata.

    constructor(private params: RouteParams,private directory: DSpaceDirectory, translate : TranslateService)
    {
        translate.setDefaultLang('en');
        translate.use('en');
        this.fields = ["dc.contributor.author","dc.date.accessioned","dc.date.available",
                        "dc.date.issued","dc.identifier.uri","dc.rights","dc.rights.uri","dc.subject","dc.title","dc.type"];
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

