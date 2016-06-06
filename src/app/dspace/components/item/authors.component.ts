import { Component, Input, OnChanges } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { Metadatum } from '../../models/metadatum.model'
import { ViewComponent } from '../../models/view-component.model'
import { ViewElementComponent } from './view-element.component';

import { FormInlineEditComponent } from '../../../utilities/form/form-inline-edit.component';

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */
@Component({
    selector: 'item-authors',
    directives: [ FormInlineEditComponent, ViewElementComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <view-element *ngIf="hasMetadata()" [header]="componentTitle | translate" class="simple-item-view-authors">
                    <!-- calls the view-element component, which takes care of rendering based on the 'header' input parameter, and the child elements of view-element-->
                    <div *ngFor="let metadatum of filteredFields;">
                        <inline-edit [model]="metadatum" property="value"></inline-edit>
                    </div>
                </view-element>
              `
})
export class AuthorsComponent extends ViewComponent implements OnChanges {

    /**
     * The data that got passed to this component from the simple/full item-view.
     */
    @Input() private itemData: Array<Metadatum>;

    /**
     * this string is written as it appears in the i18n file.
     */
    private componentTitle: string = "item-view.header.authors";

    /**
     *
     */
    constructor() {
        super(["dc.contributor.author", "dc.creator", "dc.contributor"]);
    }

    /**
     * we need to find changes that are happening in the metadata array. (removal/addition specifically)
     */
    ngOnChanges() {
        super.filterMetadata(this.itemData);
    }

}
