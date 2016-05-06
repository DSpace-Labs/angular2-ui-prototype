import {Component, Input, OnInit} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {MetadataHelper} from '../../../utilities/metadata.helper';
import {Metadatum} from '../../models/metadatum.model'
import {ViewComponent} from '../../models/viewcomponent.model';
import {ViewElementComponent} from './view-element.component';

/**
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 * This can optionally be rendered in the simple-item-view.
 * At this moment, it is not rendered.
 */
@Component({
    selector: 'item-metadata',
    inputs: ['itemData'],
    directives: [ViewElementComponent],
    pipes: [TranslatePipe],
    template: `
                <view-element [header]="componentTitle | translate">
                    <div class="item" *ngFor="let metadatum of filteredFields.metadata">
                        <strong >{{ metadatum.key }}</strong>
                        <p>{{ metadatum.value }}</p>
                    </div>
                </view-element>
              `
})
export class MetadataComponent extends ViewComponent {

    /**
     *
     */
    @Input() private itemData: Array<Metadatum>;

    /**
     *
     */
    private componentTitle: string = "item-view.metadata.title";

    constructor() {
        super(["dc.contributor.author",
                       "dc.date.accessioned",
                       "dc.date.available",
                       "dc.date.issued",
                       "dc.identifier.uri",
                       "dc.rights",
                       "dc.rights.uri",
                       "dc.subject",
                       "dc.title",
                       "dc.type"]); // list of fields we want to filter for
    }

    /**
     *
     */
    ngOnChanges() {
        super.filterMetadata(this.itemData);
    }

}
