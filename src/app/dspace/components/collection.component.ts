import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet, RouteParams } from 'angular2/router';

import { DSpaceDirectory } from '../dspace.directory';
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';
import { Collection } from "../models/collection.model";

import { ItemListComponent } from './item-list.component';

import { CollectionViewComponent } from './collection-view.component';
import { ItemCreateComponent } from './item-create.component';

/**
 * Collection component for displaying the current collection.
 * View contains sidebar context and tree hierarchy below current collection.
 */
@Component({
    selector: 'collection',
    directives: [ RouterOutlet ],
    template: ` 
                <router-outlet></router-outlet>
              `
})
@RouteConfig([

        { path: "/", name: "Collection", component: CollectionViewComponent, useAsDefault: true },
        { path: "/create-item", name: "ItemCreate", component: ItemCreateComponent }

])
export class CollectionComponent {

    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param directory
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     */
    constructor(private params: RouteParams, 
                private directory: DSpaceDirectory, 
                private breadcrumb: BreadcrumbService) {
        directory.loadObj('collection', params.get('id'), params.get('page'), params.get('limit')).then((collection:Collection) => {
            breadcrumb.visit(collection);
        });
    }

}
