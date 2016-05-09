import { Component, Input } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { TranslatePipe } from "ng2-translate/ng2-translate";

import { Collection } from "../../../models/collection.model";
import { ViewElementComponent } from '../view-element.component';

/**
 * Component for the collections of the simple-item-view.
 */
@Component({
    selector: 'item-full-collections',
    directives: [ ROUTER_DIRECTIVES, ViewElementComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <view-element [header]="componentTitle | translate">
                    <ul>
                        <li *ngIf="itemParent && itemParent.component && itemParent.id">
                            <a [routerLink]="[itemParent.component, {id: itemParent.id}]">{{ itemParent.name }}</a>
                        </li>
                    </ul>
                </view-element>
              `
})
export class FullCollectionsComponent {

    /**
     * 
     */
    @Input() private itemParent: Collection;

    /**
     * 
     */
    private componentTitle: string = "item-view.full.full-collections.title";

}
