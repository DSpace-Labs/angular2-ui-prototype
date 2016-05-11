import { Component, Input } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { Metadatum } from '../../../models/metadatum.model'
import { ViewElementComponent } from '../view-element.component';

/**
 * Renders a table of all metadata entries of an item.
 */
@Component({
    selector: 'item-full-metadata',
    pipes: [ TranslatePipe ],
    template: `
                <view-element>
                    <div id="metadata">
                        <table class="table table-hover">
                            <thead class="thead-inverse">
                                <tr>
                                    <th>{{ 'item-view.full.full-metadata.thead.key' | translate }}</th>
                                    <th>{{ 'item-view.full.full-metadata.thead.value' | translate }}</th>
                                    <th>{{ 'item-view.full.full-metadata.thead.lang' | translate }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let metadatum of itemData">
                                    <td>{{ metadatum.key }}</td>
                                    <td class="word-break">{{ metadatum.value }}</td>
                                    <td>{{ metadatum.language }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </view-element>
              `
})
export class FullMetadataComponent {

    /**
     * 
     */
    @Input() private itemData: Array<Metadatum>; // We get all metadata related to the item in question from the 'full-item-view'

}
