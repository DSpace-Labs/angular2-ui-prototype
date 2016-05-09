import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';

import { ContextProviderService } from '../services/context-provider.service';

import { ContainerHomeComponent } from "./container-home.component";
import { ItemListComponent } from './item-list.component';

import { Collection } from "../models/collection.model";

/**
 * Collection component for displaying the current collection.
 * View contains sidebar context and tree hierarchy below current collection.
 */
@Component({
    selector: 'collection',
    directives: [ ContainerHomeComponent, ItemListComponent ],
    template: ` 
                <div *ngIf="collectionProvided()">
                    <container-home [container]="collection"></container-home>
                    <item-list *ngIf="collection.items.length > 0" [collection]="collection" [items]="collection.items"></item-list>
                </div>
              `
})
export class CollectionViewComponent {

    /**
     * An object that represents the current collection.
     */
    private collection: Collection;

    /**
     *
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     */
    constructor(private contextProvider: ContextProviderService) {
        this.collection = contextProvider.context;
        contextProvider.contextObservable.subscribe(currentContext => {
            this.collection = currentContext;
        });
    }

    /**
     * Check if context provides a collection.
     */
    private collectionProvided(): boolean {
        return this.collection && this.collection.type == 'collection';
    }

}
