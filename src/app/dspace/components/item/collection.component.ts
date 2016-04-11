import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"

import {TruncatePipe} from "../../../utilities/pipes/truncate.pipe"

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";


/**
 * Component for the collections of the simple-item-view.
 * When you click on the collection name, it has to redirect to the right collection.
 */
@Component({
    selector: 'item-collection',
    inputs: ['itemData'],
    pipes: [TranslatePipe],
    template:
        `<div id="item-collection">
            <h3>{{'item-view.collection.title' | translate}}</h3>
            <a [attr.href]="collectionURIPrefix+itemData.parentCollection.id">{{ itemData.parentCollection.name }}</a>
         </div>
            `
})

export class CollectionComponent {

    public itemData : Object;
    private collectionURIPrefix = "../collections/";
    constructor(private params: RouteParams,private directory: DSpaceDirectory, translate : TranslateService)
    {
        translate.setDefaultLang('en');
        translate.use('en');
    }


}

