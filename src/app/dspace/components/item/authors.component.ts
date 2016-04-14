import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {MetadataHelper} from '../../../utilities/metadata.helper';

import {Metadatum} from '../../models/metadatum.model'

import {ComponentTitleComponent} from './component-title.component';

import {ViewElementComponent} from './view-element.component';

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */

@Component({
    selector: 'item-authors',
    directives: [ComponentTitleComponent, ViewElementComponent],
    inputs: ['itemData'],
    pipes: [TranslatePipe],
    template:
            `
                <view-element [header]="component_title | translate">
                     <div *ngFor="#metadatum of filteredFields;">
                        <p>{{ metadatum.value }}</p>
                    </div>
                </view-element>
            `
})

export class AuthorsComponent {


    private component_title = "item-view.authors.title"; // this string is written as it appears in the i18n file.

    private itemData : Metadatum[]; // Our input
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

