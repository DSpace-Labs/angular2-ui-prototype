import {Component, Input} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {Collection} from "../../models/collection.model"
import {ViewElementComponent} from './view-element.component';

/**
 * Component for the collections of the simple-item-view.
 * When you click on the collection name, it has to redirect to the right collection.
 */
@Component({
    selector: 'item-collection',
    inputs: ['itemData'],
    directives: [ViewElementComponent],
    pipes: [TranslatePipe],
    template:
        `
        <view-element [header]="componentTitle| translate">
             <a [attr.href]="collectionURIPrefix+itemData.id">{{ itemData.name }}</a>
        </view-element>
        `
})

export class CollectionComponent {

    private componentTitle = "item-view.collection.title";
    private itemData : Collection;
    private collectionURIPrefix = "../collections/";



}

