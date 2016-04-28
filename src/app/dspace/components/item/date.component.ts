import {Component} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {TruncatePipe} from "../../../utilities/pipes/truncate.pipe"
import {MetadataHelper} from '../../../utilities/metadata.helper';
import {Metadatum} from '../../models/metadatum.model'
import {ViewElementComponent} from './view-element.component'

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */
@Component({
    selector: 'item-date',
    inputs: ['itemData'],
    directives: [ViewElementComponent],
    providers: [MetadataHelper],
    pipes: [TruncatePipe, TranslatePipe],
    template: `
                <view-element [header]="componentTitle | translate">
                    <div *ngFor="#metadatum of filteredFields">
                      <!--  <p *ngIf="dateobject">{{ dateobject | date}}</p> -->
                        <!-- calling our truncate pipe without arguments will is equals to truncate : 10. (Display the first 10 chars or the string) -->
                    </div>
                </view-element>
              `
})
export class DateComponent {

    private componentTitle: string = "item-view.date.title";

    private itemData: Array<Metadatum>;

    private fields: Array<string>; // the fields that we want to show on this page.

    private filteredFields: Array<Metadatum>; // the values that we will filter out of the metadata.

    private dateobject : Date;

    constructor(private metadataHelper: MetadataHelper) {
        this.dateobject = new Date(1662);
        this.fields = ["dc.date.accessioned"];
    }

    ngOnInit() {
        this.filterMetadata();
    }

    private filterMetadata(): void {
        this.filteredFields = this.metadataHelper.filterMetadata(this.itemData,this.fields);
        // now I have these fields, create Date objects out of them.
        for(let i : number = 0; i < this.filteredFields.length;i++)
        {
            console.log(this.filteredFields[i]);

        }

    }

}
