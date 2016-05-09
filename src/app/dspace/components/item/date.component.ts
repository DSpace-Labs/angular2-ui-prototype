import { Component, Input, OnInit } from 'angular2/core';
import { TranslatePipe } from "ng2-translate/ng2-translate";

import { TruncateDatePipe } from "../../../utilities/pipes/truncatedate.pipe"
import { MetadataHelper } from '../../../utilities/metadata.helper';
import { Metadatum } from '../../models/metadatum.model'
import { ViewElementComponent } from './view-element.component'

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
export class DateComponent implements OnInit {

    /**
     * 
     */
    @Input() private itemData: Array<Metadatum>;
    
    /**
     * 
     */
    private componentTitle: string = "item-view.date.title";

    /**
     * the fields that we want to show on this page.
     */
    private fields: Array<string>;

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
        this.fields = ["dc.date.accessioned"];
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
