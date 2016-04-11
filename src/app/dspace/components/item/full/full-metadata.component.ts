import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../../dspace.directory';

import {DSpaceService} from '../../../dspace.service';

import {Item} from "../../../models/item.model"

/**
 * Renders a table of all metadata entries of an item.
 */

@Component({
    selector: 'item-full-metadata',
    inputs: ['itemData'],
    template:
        `   <div id="metadata">
                <table class="table table-hover">
                    <thead class="thead-inverse">
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Language</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="#metadatum of itemData; #index = index">
                            <td>{{ metadatum.key }}</td>
                            <td>{{ metadatum.value }}</td>
                            <td>{{ metadatum.language }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `
})

export class FullMetadataComponent {

    /**
     * TODO: replace object with inheritance model. e.g. item extends dspaceObject
     */

    itemData: Object;

    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {
    }
}

