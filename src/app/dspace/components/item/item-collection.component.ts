import { Component, Input } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { Collection } from "../../models/collection.model";
import { ViewElementComponent } from './view-element.component';

/**
 * Component for the collections of the simple-item-view.
 */
@Component({
    selector: 'item-collection',
    directives: [ ROUTER_DIRECTIVES, ViewElementComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <view-element [header]="componentTitle | translate">
                    <a *ngIf="validParent()" [routerLink]="[itemParent.component, {id: itemParent.id}]">{{ itemParent.name }}</a>
                </view-element>
              `
})
export class ItemCollectionComponent {

    /**
     * 
     */
    @Input() private itemParent: Collection;
    
    /**
     * 
     */
    private componentTitle: string = "item-view.collection.title";

    /**
     * 
     */
    private validParent(): number {
        return (this.itemParent && this.itemParent.component && this.itemParent.id);
    }

}
