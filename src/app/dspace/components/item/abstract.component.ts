import {Component, Input, OnChanges} from '@angular/core';

import {TranslatePipe} from "ng2-translate/ng2-translate";
import {ViewComponent} from '../../models/viewcomponent.model'
import {MetadataHelper} from '../../../utilities/metadata.helper';
import {Metadatum} from '../../models/metadatum.model'
import {ViewElementComponent} from './view-element.component';

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */
@Component({
    selector: 'item-abstract',
    directives: [ViewElementComponent],
    pipes: [TranslatePipe],
    template: `
                <view-element *ngIf="hasMetadata()">
                    <h3 class="visible-xs">{{componentTitle | translate}}</h3> <!-- not passed to view-element because it has a special layout options -->
                    <div *ngFor="let metadatum of filteredFields;">
                        <p>{{metadatum.value}}</p>
                    </div>
                </view-element>
              `
})
export class AbstractComponent extends ViewComponent implements OnChanges {

    /**
     *
     */
    @Input() private itemData: Array<Metadatum>;

    /**
     *
     */
    private componentTitle: string = "item-view.header.abstract";


    constructor() {
        super(["dc.description.abstract"]);
    }

    ngOnChanges() {
        super.filterMetadata(this.itemData);
    }


}
