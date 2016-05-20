import { Component, OnDestroy } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

import { DSpaceDirectory } from '../dspace.directory';
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';

import { ContainerHomeComponent } from "./container-home.component";
import { ItemListComponent } from './item-list.component';

import { Collection } from "../models/collection.model";

import { SidebarService } from '../../utilities/services/sidebar.service';
import { SidebarSection } from '../models/sidebar/sidebar-section.model';
import { CollectionSidebarHelper } from '../../utilities/collection-sidebar.helper';

import { AuthorizationService } from '../authorization/services/authorization.service';

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
export class CollectionComponent implements OnDestroy {

    /**
     * An object that represents the current collection.
     */
    private collection: Collection;


    /**
     *
     */
    sidebarHelper : CollectionSidebarHelper;


    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param dspace
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param sidebarService
     *      SidebarService is a singleton service to interact with the sidebar component.
     */
    constructor(private params: RouteParams, 
                private dspace: DSpaceDirectory, 
                private breadcrumbService: BreadcrumbService,
                private sidebarService : SidebarService,
                private authorization : AuthorizationService) {
        dspace.loadObj('collection', params.get('id'), params.get('page'), params.get('limit')).then((collection:Collection) => {
            this.collection = collection;
            breadcrumbService.visit(this.collection);
            this.sidebarHelper = new CollectionSidebarHelper(this.sidebarService,this.collection, this.authorization);
            this.sidebarHelper.populateSidebar();
        });

    }

    /**
     * Check if context provides a collection.
     */
    private collectionProvided(): boolean {
        return this.collection && this.collection.type == 'collection';
    }


    ngOnDestroy()
    {
        this.sidebarHelper.removeSections();
    }

}
