import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../../dspace.directory';

import {DSpaceService} from '../../../dspace.service';

import {Item} from "../../../models/item.model"


/**
 * Component for the collections of the simple-item-view.
 * When you click on the collection name, it has to redirect to the right collection.
 */
@Component({
    selector: 'item-full-collections',
    inputs: ['itemData'],
    template:
        `<div id="item-collection">
            <h3>This item appears in the following collection(s)</h3>
            <ul>
                <li>
                    <a [attr.href]="collectionURIPrefix+itemData.parentCollection.id">{{itemData.parentCollection.name}}</a> <!-- this needs to be updated if the item appears in multiple collections -->
                </li>
            </ul>
         </div>
            `
})

export class FullCollectionsComponent {

    public itemData : Object;
    private collectionURIPrefix = "../collections/";

    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {
    }

}

