import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {Collection} from "../../../models/collection.model";
import {ViewElementComponent} from '../view-element.component';

/**
 * Component for the collections of the simple-item-view.
 */
@Component({
    selector: 'item-full-collections',
    inputs: ['itemParent'],
    directives: [ROUTER_DIRECTIVES, ViewElementComponent],
    pipes: [TranslatePipe],
    template: `
                <view-element [header]="componentTitle | translate">
                    <ul>
                        <li>
                            <a *ngIf="itemParent && itemParent.component && itemParent.id" [routerLink]="[itemParent.component, {id: itemParent.id}]">{{ itemParent.name }}</a>
                        </li>
                    </ul>
                </view-element>
              `
})
export class FullCollectionsComponent {

    private componentTitle : String = "item-view.full.full-collections.title";

    private itemParent : Collection;

}
