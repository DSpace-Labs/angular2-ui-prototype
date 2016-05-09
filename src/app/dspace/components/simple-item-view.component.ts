import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {AuthorsComponent} from './item/authors.component';
import {DateComponent} from './item/date.component';
import {MetadataComponent} from './item/metadata.component';
import {ItemCollectionComponent} from './item/item-collection.component';
import {UriComponent} from './item/uri.component';
import {BitstreamsComponent} from './item/bitstreams.component';
import {ThumbnailComponent} from './item/thumbnail.component';
import {ItemComponent} from './item.component';

import {Metadatum} from '../models/metadatum.model';
import {Item} from '../models/item.model';
import {ContextProviderService} from '../services/context-provider.service';

/**
 * A simple item view, the user first gets redirected here and can optionally view the full item view.
 *
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'simple-item-view',
    directives: [AuthorsComponent,
                 DateComponent,
                 ItemCollectionComponent,
                 UriComponent,
                 ROUTER_DIRECTIVES,
                 BitstreamsComponent,
                 ThumbnailComponent],
    pipes: [TranslatePipe],
    template: `
                <div *ngIf="itemProvided()">
                    <div class="item-summary-view-metadata">
                        <h1>{{item.name}}</h1>
                        <div class="row">
                            <div class="col-sm-4">
                                <item-thumbnail></item-thumbnail>
                                <item-bitstreams [itemBitstreams]="item.bitstreams"></item-bitstreams>
                                <item-date [itemData]="item.metadata"></item-date>
                                <item-authors [itemData]="item.metadata"></item-authors>
                                <h3>{{'item-view.show-full' | translate}}</h3>
                                <a [routerLink]="[item.component, {id: item.id}, 'FullItemView']">{{'item-view.show-full' | translate}}</a>
                            </div>
                            <div class="col-sm-8">
                                <item-uri [itemData]="item.metadata"></item-uri>
                                <item-collection [itemParent]="item.parentCollection"></item-collection>
                            </div>
                        </div>
                    </div>
                </div>
              `
})
export class SimpleItemViewComponent {

    /**
     * The current item.
     */
    private item : Item;

    /**
     *
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     * @param translate
     *      TranslateService
     */
    constructor(private contextProvider: ContextProviderService,
                private translate: TranslateService) {
        this.item = contextProvider.context;
        contextProvider.contextObservable.subscribe(currentContext => {
            this.item = currentContext;

            // this actually gets called when navigating to a collection
            if(this.item.newMetadata)
            {
                this.item.newMetadata.subscribe(t =>
                {
                    let tempArray = this.item.metadata.slice(0);
                    this.item.metadata = tempArray;
                });
            }
        });

        console.log("constructed");
    }

    /**
     * Check if context provides an item.
     */
    private itemProvided(): boolean {
        return this.item && this.item.type == 'item';
    }

    ngOnInit()
    {
        // test with altering this item.
        setTimeout( () =>
        {
            let mdauthor : Metadatum = new Metadatum();
            mdauthor.setKey("dc.contributor.author");
            mdauthor.setValue("John Doe");
            this.item.addMetadata(mdauthor);

            let mduri : Metadatum = new Metadatum();
            mduri.setKey("dc.identifier.uri");
            mduri.setValue("http://www.google.be");
            this.item.addMetadata(mduri);
        },10000);
    }
}
