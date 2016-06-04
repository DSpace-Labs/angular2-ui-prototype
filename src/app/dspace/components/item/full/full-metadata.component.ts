import { Component, Input } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { ContextProviderService } from '../../../services/context-provider.service';

import { Metadatum } from '../../../models/metadatum.model'
import { ViewElementComponent } from '../view-element.component';

import { InlineEditComponent } from '../../inline-edit.component';

/**
 * Renders a table of all metadata entries of an item.
 */
@Component({
    selector: 'item-full-metadata',
    directives: [ InlineEditComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <view-element>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="thead-inverse">
                                <tr>
                                    <th>{{ 'item-view.full.full-metadata.thead.key' | translate }}</th>
                                    <th>{{ 'item-view.full.full-metadata.thead.value' | translate }}</th>
                                    <th>{{ 'item-view.full.full-metadata.thead.lang' | translate }}</th>
                                    <th *ngIf="editing()">{{ 'item-view.full.full-metadata.thead.remove' | translate }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let metadatum of itemData">
                                    <td class="item-full-metadata-label-cell">{{ metadatum.key }}</td>
                                    <td>
                                        <!-- <div class="word-break item-full-metadata-data-cell">{{ metadatum.value }}</div> -->
                                        <inline-edit class="word-break item-full-metadata-data-cell" [model]="metadatum" property="value"></inline-edit>
                                    </td>
                                    <td class="item-full-metadata-language-cell">{{ metadatum.language }}</td>
                                    
                                    <td class="item-full-metadata-remove-cell">
                                        <span *ngIf="removable(metadatum)" class="glyphicon glyphicon-trash clickable" (click)="remove(metadatum)"></span>
                                    </td>
                                    
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
    
    /**
     * 
     */
    constructor(private contextProvider: ContextProviderService) {}
    
    /**
     * 
     */
    remove(metadatum: Metadatum): void {
        console.log('remove');        
    }

    /**
     * 
     */
    editing(): boolean {
        return this.itemData ? this.contextProvider.editing : false;
    }

    /**
     * 
     */
    removable(metadatum: Metadatum): boolean {
        return this.editing() && metadatum['editable'];
    }

}
