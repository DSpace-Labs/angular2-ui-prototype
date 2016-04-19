import {Component, Inject, forwardRef} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {ContextComponent} from '../../navigation/components/context.component';
import {FullMetadataComponent} from './item/full/full-metadata.component.ts';
import {FullBitstreamsComponent} from './item/full/full-bitstreams.component';
import {FullCollectionsComponent} from './item/full/full-collections.component';
import {ItemComponent} from './item.component';

import {Item} from '../models/item.model'

/**
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'full-item-view',
    directives: [ContextComponent,
                 FullMetadataComponent,
                 FullBitstreamsComponent,
                 FullCollectionsComponent,
                 ROUTER_DIRECTIVES],
    pipes: [TranslatePipe],
    template: `
                <div class="container" *ngIf="parent.item">
                    <div class="col-xs-12 col-sm-12 col-md-9 main-content">
                        <!-- link to the simple item view -->
                        <a [routerLink]="[parent.item.component, {id: parent.item.id}]">{{'item-view.show-simple' | translate}}</a>
                        <context [context]="parent.item"></context>
                        <div>
                            <!-- the rendering of different parts of the page is delegated to other components -->
                            <item-full-metadata [itemData]="parent.item.metadata"></item-full-metadata>

                            <item-full-bistreams [itemBitstreams]="parent.item.bitstreams"></item-full-bistreams>

                            <item-full-collections [itemParent]="parent.item.parentCollection"></item-full-collections>

                            <a [routerLink]="[parent.item.component, {id: parent.item.id}]">{{'item-view.show-simple' | translate}}</a>
                        </div>
                    </div>
                </div>
              `
})
export class FullItemViewComponent {

    constructor(@Inject(forwardRef(() => ItemComponent)) private parent: ItemComponent) {}

}
