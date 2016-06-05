import { Component, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { ContextProviderService } from '../services/context-provider.service';
import { NotificationService } from '../../utilities/notification/notification.service';

import { FullMetadataComponent } from './item/full/full-metadata.component.ts';
import { FullBitstreamsComponent } from './item/full/full-bitstreams.component';
import { FullCollectionsComponent } from './item/full/full-collections.component';

import { InlineEditComponent } from './inline-edit.component';

import { Item } from '../models/item.model';
import { Notification } from '../../utilities/notification/notification.model';

/**
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'full-item-view',
    directives: [ FullMetadataComponent,
                  FullBitstreamsComponent,
                  FullCollectionsComponent,
                  InlineEditComponent,
                  ROUTER_DIRECTIVES ],
    pipes: [ TranslatePipe ],
    template: `
                <div class="main-content" *ngIf="itemProvided()">
                    <inline-edit class="page-header" [model]="item" property="name"></inline-edit>
                    <!-- link to the simple item view -->
                    <div class="text-center">
                        <a class="btn btn-default" [routerLink]="[item.component, {id: item.id}]">{{ 'item-view.show-simple' | translate }}</a>
                        <a *ngIf="editing()" class="btn btn-default" (click)="exitEditMode()">{{ 'item-view.exit-edit-mode' | translate }}</a>
                    </div>
                    <div>
                        <!-- the rendering of different parts of the page is delegated to other components -->
                        <item-full-metadata [itemData]="item.metadata"></item-full-metadata>
                        <item-full-bitstreams [itemBitstreams]="item.bitstreams" [thumbnails]="item.thumbnails"></item-full-bitstreams>
                        <item-full-collections [itemParent]="item.parentCollection"></item-full-collections>
                    </div>
                    <div class="text-center">
                        <a class="btn btn-default" [routerLink]="[item.component, {id: item.id}]">{{ 'item-view.show-simple' | translate }}</a>
                        <a *ngIf="editing()" class="btn btn-default" (click)="exitEditMode()">{{ 'item-view.exit-edit-mode' | translate }}</a>
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
    private subscriptions: Array<any>;

    /**
     *
     */
    constructor(private translate: TranslateService,
                private contextProvider: ContextProviderService,
                private notificationService: NotificationService) {
        
        this.subscriptions = new Array<any>();
        
        this.item = contextProvider.context;
        
        let csub = contextProvider.contextObservable.subscribe(currentContext => {
            this.item = currentContext;
        });
        
        this.subscriptions.push(csub);
        
        let esub = contextProvider.editingObservable.subscribe(editing => {
            if(editing) {
                if(this.editingNotification === undefined) {
                    this.editingNotification = new Notification('WARNING', translate.instant('edit.mode'));
                }
                this.notificationService.add('item', this.editingNotification);
            }
        });
        
        this.subscriptions.push(esub);
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
    private editing(): boolean {
        return this.contextProvider.editing;
    }

    /**
     * 
     */
    private exitEditMode(): void {
        this.contextProvider.editing = false;
        this.notificationService.remove('item', this.editingNotification);
    }
    
    /**
     *
     */
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.exitEditMode();
    }
    
}
