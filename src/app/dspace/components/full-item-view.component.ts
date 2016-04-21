import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {ContextComponent} from '../../navigation/components/context.component';
import {FullMetadataComponent} from './item/full/full-metadata.component.ts';
import {FullBitstreamsComponent} from './item/full/full-bitstreams.component';
import {FullCollectionsComponent} from './item/full/full-collections.component';
import {ItemComponent} from './item.component';

import {Item} from '../models/item.model'

import {ItemStoreService} from '../services/item-store.service'

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
                <div class="container" *ngIf="item">
                    <div class="row">
                        <div class="clearfix">

                            <div class="col-xs-6 col-sm-3">
                                <context [context]="item"></context>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-9 main-content">

                                <h1>{{item.name}}</h1>
                                <!-- link to the simple item view -->
                                <a [routerLink]="[item.component, {id: item.id}]">{{'item-view.show-simple' | translate}}</a>

                                <div>
                                    <!-- the rendering of different parts of the page is delegated to other components -->
                                    <item-full-metadata [itemData]="item.metadata"></item-full-metadata>

                                    <item-full-bistreams [itemBitstreams]="item.bitstreams"></item-full-bistreams>

                                    <item-full-collections [itemParent]="item.parentCollection"></item-full-collections>

                                    <a [routerLink]="[item.component, {id: item.id}]">{{'item-view.show-simple' | translate}}</a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
              `
})
export class FullItemViewComponent {

    /**
     * The current item.
     */
    item : Item;

    constructor(private itemStore : ItemStoreService) {
        this.item = itemStore.item;
        itemStore.itemObservable.subscribe(currentItem => {
            this.item = currentItem;
        });
    }

}
