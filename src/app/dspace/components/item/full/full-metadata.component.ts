import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../../dspace.directory';

import {DSpaceService} from '../../../dspace.service';

import {Item} from "../../../models/item.model"

import {TranslatePipe} from "ng2-translate/ng2-translate";

import {MetadataHelper} from '../../../../utilities/metadata.helper';

import {Metadatum} from '../../../models/metadatum.model'

import {ViewElementComponent} from '../view-element.component';

/**
 * Renders a table of all metadata entries of an item.
 */

@Component({
    selector: 'item-full-metadata',
    inputs: ['itemData'],
    pipes: [TranslatePipe],
    template:
        `
       <view-element>
        <div id="metadata">
                <table class="table table-hover">
                    <thead class="thead-inverse">
                        <tr>
                            <th>{{'item-view.full.full-metadata.thead.key' | translate}}</th>
                            <th>{{'item-view.full.full-metadata.thead.value' | translate}}</th>
                            <th>{{'item-view.full.full-metadata.thead.lang' | translate}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="#metadatum of itemData">
                            <td>{{ metadatum.getKey() }}</td> <!-- need to use a getter here because a key is composed of other fields -->
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

    private itemData: Metadatum[];

    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {
    }

}

