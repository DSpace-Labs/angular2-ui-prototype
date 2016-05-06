import {Component, Input, OnInit} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {TruncateDatePipe} from "../../../utilities/pipes/truncatedate.pipe"
import {Metadatum} from '../../models/metadatum.model'
import {ViewElementComponent} from './view-element.component'
import {ViewComponent} from '../../models/viewcomponent.model';

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */
@Component({
    selector: 'item-date',
    directives: [ViewElementComponent],
    pipes: [TruncateDatePipe, TranslatePipe],
    template: `
                <view-element [header]="componentTitle | translate">
                    <div *ngFor="let metadatum of filteredFields">
                        <p>{{ metadatum.value | truncatedate}}</p>
                        <!-- calling our truncate pipe without arguments will is equals to truncate : 10. (Display the first 10 chars or the string) -->
                    </div>
                </view-element>
              `
})
export class DateComponent extends ViewComponent implements OnInit{

    /**
     * 
     */
    @Input() private itemData: Array<Metadatum>;
    
    /**
     * 
     */
    private componentTitle: string = "item-view.date.title";
    private itemData: Array<Metadatum>;

    constructor()
    {
        super(["dc.date.accessioned"]);
    }

    /**
     * 
     */
    ngOnInit() {
        super.filterMetadata(this.itemData);
    }


}
