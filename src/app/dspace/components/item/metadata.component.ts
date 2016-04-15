import {Component, Input} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {MetadataHelper} from '../../../utilities/metadata.helper';
import {Metadatum} from '../../models/metadatum.model'
import {ViewElementComponent} from './view-element.component';

/**
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 * This can optionally be rendered in the simple-item-view.
 * At this moment, it is not rendered.
 */
@Component({
    selector: 'item-metadata',
    inputs: ['itemData'],
    directives: [ViewElementComponent],
    pipes: [TranslatePipe],
    template:
        `
        <view-element [header]="componentTitle | translate">
            <div *ngFor="#metadatum of filteredFields.metadata;" class="item">
                <strong >{{ metadatum.key }}</strong>
                <p>{{ metadatum.value }}</p>
            </div>
        </view-element>
            `
})

export class MetadataComponent {

    private componentTitle = "item-view.metadata.title";
    private itemData : Metadatum[];
    private fields : String[]; // the fields that we want to show on this page.
    private filteredFields : Metadatum[]; // the values that we will filter out of the metadata.

    constructor()
    {
        this.fields = ["dc.contributor.author","dc.date.accessioned","dc.date.available",
                        "dc.date.issued","dc.identifier.uri","dc.rights","dc.rights.uri","dc.subject","dc.title","dc.type"]; // list of fields we want to filter for
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

