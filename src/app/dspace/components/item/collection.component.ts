import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {Collection} from "../../models/collection.model";
import {ViewElementComponent} from './view-element.component';

/**
 * Component for the collections of the simple-item-view.
 */
@Component({
    selector: 'item-collection',
    inputs: ['itemParent'],
    directives: [ROUTER_DIRECTIVES, ViewElementComponent],
    pipes: [TranslatePipe],
    template: `
                <view-element [header]="componentTitle | translate">
                    <a *ngIf="hasValidParent()" [routerLink]="[itemParent.component, {id: itemParent.id}]">{{ itemParent.name }}</a>
                </view-element>
              `
})
export class CollectionComponent {

    private componentTitle: string = "item-view.collection.title";

    private itemParent: Collection;

    private hasValidParent(): number {
        return (this.itemParent && this.itemParent.component && this.itemParent.id);
    }

}
