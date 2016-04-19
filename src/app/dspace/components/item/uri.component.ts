import {Component} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {MetadataHelper} from '../../../utilities/metadata.helper';
import {Metadatum} from '../../models/metadatum.model'
import {ViewElementComponent} from './view-element.component';

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */
@Component({
    selector: 'item-uri',
    inputs: ['itemData'],
    directives: [ViewElementComponent],
    providers: [MetadataHelper],
    pipes: [TranslatePipe],
    template: `
                <view-element [header]="componentTitle | translate">
                    <div *ngFor="#metadatum of filteredFields;">
                        <a [attr.href]="metadatum.value">{{ metadatum.value}}</a> <!-- renders a clickable URI (in this case of the value inside dc.identifier.uri, e.g the handle)-->
                    </div>
                </view-element>
              `
})
export class UriComponent {

    private componentTitle: string = "item-view.uri.title";

    private itemData: Array<Metadatum>;

    private fields: Array<string>; // the fields that we want to show on this page.

    private filteredFields: Array<Metadatum>; // the values that we will filter out of the metadata.

    constructor(private metadataHelper: MetadataHelper) {
        this.fields = ["dc.identifier.uri"];
    }

    ngOnInit() {
        this.filterMetadata();
    }

    private filterMetadata(): void {
        this.filteredFields = this.metadataHelper.filterMetadata(this.itemData,this.fields);
    }

}
