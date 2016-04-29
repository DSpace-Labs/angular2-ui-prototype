import {Component} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {ViewComponent} from '../../models/viewcomponent.model';
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
export class UriComponent extends ViewComponent{

    private componentTitle: string = "item-view.uri.title";
    private itemData: Array<Metadatum>;

    constructor() {
        super(["dc.identifier.uri"]);
    }

    ngOnChanges() {
        super.filterMetadata(this.itemData);
    }

}
