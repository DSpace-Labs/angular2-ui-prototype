import { Component, Input, OnChanges } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { ViewComponent } from '../../models/viewcomponent.model';
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
                <view-element *ngIf="hasMetadata()" [header]="componentTitle | translate" class="simple-item-view-uri">
                    <div *ngFor="let metadatum of filteredFields;">
                        <!-- renders a clickable URI (in this case of the value inside dc.identifier.uri, e.g the handle)-->
                        <a [attr.href]="metadatum.value">{{ metadatum.value }}</a>
                    </div>
                </view-element>
              `
})
export class UriComponent extends ViewComponent implements OnChanges{

    /**
     * 
     */
    @Input() private itemData: Array<Metadatum>;
    
    /**
     * 
     */
    private componentTitle: string = "item-view.header.uri";


    /**
     *
     */
    constructor() {
        super(["dc.identifier.uri"]);
    }

    /**
     *
     */
    ngOnChanges() {
        super.filterMetadata(this.itemData);
    }

}
