import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {FullMetadataComponent} from './item/full/full-metadata.component.ts';
import {FullBitstreamsComponent} from './item/full/full-bitstreams.component';
import {FullCollectionsComponent} from './item/full/full-collections.component';
import {ItemComponent} from './item.component';

import {Metadatum} from '../models/metadatum.model';
import {Item} from '../models/item.model';
import {ContextProviderService} from '../services/context-provider.service';

/**
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'full-item-view',
    directives: [FullMetadataComponent,
                 FullBitstreamsComponent,
                 FullCollectionsComponent,
                 ROUTER_DIRECTIVES],
    pipes: [TranslatePipe],
    template: `
                <div class="main-content" *ngIf="itemProvided()">
                    
                    <h1>{{item.name}}</h1>
                    <!-- link to the simple item view -->
                    <a [routerLink]="[item.component, {id: item.id}]">{{'item-view.show-simple' | translate}}</a>

                    <div>
                        <!-- the rendering of different parts of the page is delegated to other components -->
                        <item-full-metadata [itemData]="item.metadata"></item-full-metadata>

                        <item-full-bitstreams [itemBitstreams]="item.bitstreams"></item-full-bitstreams>

                        <item-full-collections [itemParent]="item.parentCollection"></item-full-collections>

                        <a [routerLink]="[item.component, {id: item.id}]">{{'item-view.show-simple' | translate}}</a>
                    </div>

                </div>
              `
})
export class FullItemViewComponent {

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
        });
    }

    /**
     * Check if context provides a community.
     */
    private itemProvided(): boolean {
        return this.item && this.item.type == 'item';
    }

    ngOnChanges()
    {
        // test method to update the array of metadata.

        // test with altering this item.
        if(this.item!=null)
        {
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
            },1000);
        }
    }
}
