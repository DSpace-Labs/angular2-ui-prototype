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
    selector: 'item-authors',
    directives: [ViewElementComponent],
    inputs: ['itemData'],
    pipes: [TranslatePipe],
    providers: [MetadataHelper],
    template:
            `
                <view-element [header]="componentTitle | translate"> <!--translate it before passing it on.-->
                    <!-- calls the view-element component, which takes care of rendering based on the 'header' input parameter, and the child elements of view-element-->
                    <div *ngFor="#metadatum of filteredFields;">
                        <p>{{ metadatum.value }}</p>
                    </div>
                </view-element>
            `
})
export class AuthorsComponent {

    private componentTitle: string = "item-view.authors.title"; // this string is written as it appears in the i18n file.

    private itemData: Array<Metadatum>; // Our input

    private fields: Array<string>; // the fields that we want to show on this page.

    private filteredFields: Array<Metadatum>; // the values that we will filter out of the metadata.

    constructor(private metadataHelper: MetadataHelper) {
        this.fields = ["dc.contributor.author", "dc.creator", "dc.contributor"];
    }

    ngOnInit() {
        this.filterMetadata();
    }

    // filter the metadata, only displays the ones we have listed in the 'fields' variable.
    private filterMetadata(): void {
        this.filteredFields = this.metadataHelper.filterMetadata(this.itemData, this.fields);
    }

}