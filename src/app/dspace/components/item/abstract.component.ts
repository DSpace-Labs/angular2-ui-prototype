import {Component, Input, OnInit} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

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
                <view-element>
                    <h3 class="visible-xs">{{componentTitle | translate}}</h3>
                    <div *ngFor="#metadatum of filteredFields">
                        <p>{{metadatum.value}}</p>
                    </div>
                </view-element>
              `
})
export class AbstractComponent implements OnInit {

    /**
     *
     */
    @Input() private itemData: Array<Metadatum>;

    /**
     *
     */
    private componentTitle: string = "item-view.uri.abstract";

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
     */
    constructor(private metadataHelper: MetadataHelper) {
        this.fields = ["dc.description.abstract"];
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