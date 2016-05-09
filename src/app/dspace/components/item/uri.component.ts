import { Component, Input, OnInit } from 'angular2/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { MetadataHelper } from '../../../utilities/metadata.helper';
import { Metadatum } from '../../models/metadatum.model'
import { ViewElementComponent } from './view-element.component';

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */
@Component({
    selector: 'item-uri',
    directives: [ ViewElementComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <view-element [header]="componentTitle | translate">
                    <div *ngFor="let metadatum of filteredFields;">
                        <!-- renders a clickable URI (in this case of the value inside dc.identifier.uri, e.g the handle)-->
                        <a [attr.href]="metadatum.value">{{ metadatum.value }}</a>
                    </div>
                </view-element>
              `
})
export class UriComponent implements OnInit {

    /**
     * 
     */
    @Input() private itemData: Array<Metadatum>;
    
    /**
     * 
     */
    private componentTitle: string = "item-view.uri.title";

    /**
     * the fields that we want to show on this page.
     */
    private fields: Array<string>; // 

    /**
     * the values that we will filter out of the metadata.
     */
    private filteredFields: Array<Metadatum>; 

    /**
     * 
     * @param metadataHelper
     *      MetadataHelper is a singleton service used to filter metadata fields.
     */
    constructor(private metadataHelper: MetadataHelper) {
        this.fields = ["dc.identifier.uri"];
    }

    /**
     * 
     */
    ngOnInit() {
        this.filterMetadata();
    }

    /**
     * 
     */
    private filterMetadata(): void {
        this.filteredFields = this.metadataHelper.filterMetadata(this.itemData,this.fields);
    }

}
