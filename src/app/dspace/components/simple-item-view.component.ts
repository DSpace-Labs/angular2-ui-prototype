import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { ContextProviderService } from '../services/context-provider.service';

import { AbstractComponent } from './item/abstract.component';
import { AuthorsComponent } from './item/authors.component';
import { BitstreamsComponent } from './item/bitstreams.component';
import { DateComponent } from './item/date.component';
import { ItemCollectionComponent } from './item/item-collection.component';
import { ItemComponent } from './item.component';
import { MetadataComponent } from './item/metadata.component';
import { ThumbnailComponent } from './item/thumbnail.component';
import { UriComponent } from './item/uri.component';

import { Item } from '../models/item.model';

/**
 * A simple item view, the user first gets redirected here and can optionally view the full item view.
 *
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'simple-item-view',
    directives: [ ROUTER_DIRECTIVES,
                  AbstractComponent,
                  AuthorsComponent,
                  BitstreamsComponent,
                  DateComponent,
                  ItemCollectionComponent,
                  ThumbnailComponent,
                  UriComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <div *ngIf="itemProvided()">
                    <div class="item-summary-view-metadata">
                        <h1>{{item.name}}</h1>
                        <div class="row">
                            <div class="col-sm-4">
                                <thumbnail [thumbnailLink]="item.thumbnail"></thumbnail>
                                <item-bitstreams [itemBitstreams]="item.bitstreams"></item-bitstreams>
                                <item-date [itemData]="item.metadata"></item-date>
                                <item-authors [itemData]="item.metadata"></item-authors>
                                <h3>{{ 'item-view.show-full' | translate }}</h3>
                                <a [routerLink]="[item.component, {id: item.id}, 'FullItemView']">{{ 'item-view.show-full' | translate }}</a>
                            </div>
                            <div class="col-sm-8">
                                <item-abstract [itemData]="item.metadata"></item-abstract>
                                <item-uri [itemData]="item.metadata"></item-uri>
                                <item-collection [itemParent]="item.parentCollection"></item-collection>
                            </div>
                        </div>
                    </div>
                </div>
              `
})
export class SimpleItemViewComponent  { // uses OnInit for testing purposes.

    /**
     * The current item.
     */
    private item: Item;

    /**
     *
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     */
    constructor(private contextProvider: ContextProviderService) {
        this.item = contextProvider.context;
        contextProvider.contextObservable.subscribe(currentContext => {
            this.item = currentContext;
        });
    }



    /**
     * Check if context provides an item.
     */
    private itemProvided(): boolean {
        return this.item && this.item.type == 'item';
    }


}
