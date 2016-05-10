import { Component, Input, OnChanges } from 'angular2/core';
import { TranslatePipe } from "ng2-translate/ng2-translate";

import { TruncateDatePipe } from "../../../utilities/pipes/truncatedate.pipe"
import { MetadataHelper } from '../../../utilities/metadata.helper';
import { Metadatum } from '../../models/metadatum.model'
import { ViewElementComponent } from '../../view-element.component'

import {ViewComponent} from '../../models/viewcomponent.model';

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */
@Component({
    selector: 'item-date',
    directives: [ ViewElementComponent ],
    pipes: [ TruncateDatePipe, TranslatePipe ],
    template: `
                <view-element [header]="componentTitle | translate">
                    <div *ngFor="let metadatum of filteredFields">
                        <p>{{ metadatum.value | truncatedate }}</p>
                        <!-- calling our truncate pipe without arguments will is equals to truncate : 10. (Display the first 10 chars or the string) -->
                    </div>
                </view-element>
              `
})
export class DateComponent extends ViewComponent implements OnChanges {

    /**
     *
     */
    @Input() private itemData: Array<Metadatum>;

    /**
     *
     */
    private componentTitle: string = "item-view.header.date";


    /**
     *
     * @param metadataHelper
     *      MetadataHelper is a singleton service used to filter metadata fields.
     */
    constructor(private metadataHelper: MetadataHelper) {
        super(["dc.date.accessioned"]);
    }

   ngOnChanges()
   {
       super.filterMetadata(this.itemData);
   }

}
