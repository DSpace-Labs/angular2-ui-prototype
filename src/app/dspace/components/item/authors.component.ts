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
    selector: 'item-authors',
    directives: [ViewElementComponent],
    pipes: [TranslatePipe],
    template:
            `
                <view-element [header]="componentTitle | translate"> <!--translate it before passing it on.-->
                    <!-- calls the view-element component, which takes care of rendering based on the 'header' input parameter, and the child elements of view-element-->
                    <div *ngFor="let metadatum of filteredFields;">
                        <p>{{ metadatum.value }}</p>
                    </div>
                </view-element>
            `
})
export class AuthorsComponent implements OnInit {

    /**
     *  
     */
    @Input() private itemData: Array<Metadatum>;
    
    /**
     * this string is written as it appears in the i18n file.
     */
    private componentTitle: string = "item-view.authors.title"; 

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
     */
    constructor(private metadataHelper: MetadataHelper) {
        this.fields = ["dc.contributor.author", "dc.creator", "dc.contributor"];
    }

    /**
     *  
     */
    ngOnInit() {
        this.filterMetadata();
    }

    /**
     * filter the metadata, only displays the ones we have listed in the 'fields' variable. 
     */ 
    private filterMetadata(): void {
        this.filteredFields = this.metadataHelper.filterMetadata(this.itemData, this.fields);
    }

}
