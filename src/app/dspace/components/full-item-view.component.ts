import { Component, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { ContextProviderService } from '../services/context-provider.service';
import { NotificationService } from '../../utilities/notification/notification.service';
import { Notification } from '../../utilities/notification/notification.model';

import { FullMetadataComponent } from './item/full/full-metadata.component.ts';
import { FullBitstreamsComponent } from './item/full/full-bitstreams.component';
import { FullCollectionsComponent } from './item/full/full-collections.component';

import { Item } from '../models/item.model';

/**
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'full-item-view',
    directives: [ FullMetadataComponent,
                  FullBitstreamsComponent,
                  FullCollectionsComponent,
                  ROUTER_DIRECTIVES ],
    pipes: [ TranslatePipe ],
    template: `
                <div class="main-content" *ngIf="itemProvided()">
                    <h1 class="page-header">{{ item.name }}</h1>
                    <!-- link to the simple item view -->
                    <div class="text-center">
                        <a class="btn btn-default" [routerLink]="[item.component, {id: item.id}]">{{ 'item-view.show-simple' | translate }}</a>
                        <a *ngIf="contextEditMode()" class="btn btn-default" (click)="exitEditMode()">{{ 'item-view.exit-edit-mode' | translate }}</a>
                    </div>
                    <div>
                        <!-- the rendering of different parts of the page is delegated to other components -->
                        <item-full-metadata [itemData]="item.metadata"></item-full-metadata>

                        <item-full-bitstreams [itemBitstreams]="item.bitstreams" [thumbnails]="item.thumbnails"></item-full-bitstreams>

                        <item-full-collections [itemParent]="item.parentCollection"></item-full-collections>
                    </div>
                    <div class="text-center">
                        <a class="btn btn-default" [routerLink]="[item.component, {id: item.id}]">{{ 'item-view.show-simple' | translate }}</a>
                        <a *ngIf="contextEditMode()" class="btn btn-default" (click)="exitEditMode()">{{ 'item-view.exit-edit-mode' | translate }}</a>
                    </div>
                </div>
              `
})
export class FullItemViewComponent implements OnDestroy {

    /**
     * The current item.
     */
    private item: Item;
    
    /**
     * 
     */
    private editingNotification: Notification;
    
    /**
     * 
     */
    private subscription: any;

    /**
     *
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     */
    constructor(private contextProvider: ContextProviderService,
                private notificationService: NotificationService) {
        this.item = contextProvider.context;
        this.editingNotification = new Notification('DANGER', "You are in edit mode.");        
        this.subscription = contextProvider.contextObservable.subscribe(currentContext => {
            this.item = currentContext;
            if(this.item['editing']) {
                this.notificationService.add('item', this.editingNotification);
            }
        });
    }

    /**
     * Check if context provides a community.
     */
    private itemProvided(): boolean {
        return this.item && this.item.type == 'item';
    }
    
    /**
     * 
     */
    private contextEditMode(): boolean {
        return this.item && this.item['editing'];
    }

    /**
     * 
     */
    private exitEditMode(): void {
        this.contextProvider.disableEditMode();
        this.notificationService.remove('item', this.editingNotification);
    }
    
    /**
     *
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.exitEditMode();
    }
    
}
