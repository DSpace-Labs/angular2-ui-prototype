import {Component, Inject, forwardRef} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {ContextComponent} from '../../navigation/components/context.component';
import {AuthorsComponent} from './item/authors.component';
import {DateComponent} from './item/date.component';
import {MetadataComponent} from './item/metadata.component';
import {CollectionComponent} from './item/collection.component';
import {UriComponent} from './item/uri.component';
import {BitstreamsComponent} from './item/bitstreams.component';
import {ThumbnailComponent} from './item/thumbnail.component';
import {ItemComponent} from './item.component';

import {Item} from '../models/item.model'

/**
 * A simple item view, the user first gets redirected here and can optionally view the full item view.
 *
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'simple-item-view',
    directives: [ContextComponent,
                 AuthorsComponent,
                 DateComponent,
                 CollectionComponent,
                 UriComponent,
                 ROUTER_DIRECTIVES,
                 BitstreamsComponent,
                 ThumbnailComponent],
    pipes: [TranslatePipe],
    template: `
                <div class="container" *ngIf="parent.item">
                    <div class="row">
                        <div class="col-md-12">
                            <context [context]="parent.item"></context>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <item-thumbnail></item-thumbnail>
                            <item-bitstreams [itemBitstreams]="parent.item.bitstreams"></item-bitstreams>
                            <item-date [itemData]="parent.item.metadata"></item-date>
                            <item-authors [itemData]="parent.item.metadata"></item-authors>
                            <h3>Metadata</h3>
                            <a [routerLink]="[parent.item.component, {id: parent.item.id}, 'FullItemView']">{{'item-view.show-full' | translate}}</a>
                        </div>
                        <div class="col-md-8">
                            <item-uri [itemData]="parent.item.metadata"></item-uri>
                            <item-collection [itemParent]="parent.item.parentCollection"></item-collection>
                        </div>
                    </div>
                </div>
              `
})
export class SimpleItemViewComponent {

    constructor(@Inject(forwardRef(() => ItemComponent)) private parent: ItemComponent) {}

}
