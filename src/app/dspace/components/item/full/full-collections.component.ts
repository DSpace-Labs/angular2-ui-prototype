import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../../dspace.directory';

import {DSpaceService} from '../../../dspace.service';

import {Item} from "../../../models/item.model"

import {TranslatePipe} from "ng2-translate/ng2-translate";

import {ViewElementComponent} from '../view-element.component';

/**
 * Component for the collections of the simple-item-view.
 * When you click on the collection name, it has to redirect to the right collection.
 */
@Component({
    selector: 'item-full-collections',
    inputs: ['itemData'],
    directives: [ViewElementComponent],
    pipes: [TranslatePipe],
    template:
        `
        <view-element [header]="componentTitle | translate">
            <ul>
                <li>
                   <a [attr.href]="collectionURIPrefix+itemData.id">{{itemData.name}}</a>
                </li>
            </ul>

        </view-element>
        `
})

export class FullCollectionsComponent {

    private componentTitle : String = "item-view.full.full-collections.title";
    private itemData : Object;
    private collectionURIPrefix = "../collections/";

    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {
    }

}

