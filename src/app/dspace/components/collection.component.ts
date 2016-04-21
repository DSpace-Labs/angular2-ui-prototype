import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';
import {BreadcrumbService} from '../../navigation/services/breadcrumb.service';
import {Collection} from "../models/collection.model";
import {ListComponent} from '../../navigation/components/list.component';
import {ContextComponent} from '../../navigation/components/context.component';
import {PaginationComponent} from '../../navigation/components/pagination.component';
import {ContainerHomeComponent} from "./container-home.component";

import {ItemListComponent} from './item-list.component';

import {Item} from '../models/item.model';

/**
 * Collection component for displaying the current collection.
 * View contains sidebar context and tree hierarchy below current collection.
 */
@Component({
    selector: 'collection',
    directives: [ListComponent, ContextComponent, ContainerHomeComponent, ItemListComponent],
    pipes: [TranslatePipe],
    template: ` 
                <div class="container" *ngIf="collection">
                    <div class="col-md-12">
                    <!-- replace with collection model -->
                        <context [context]="collectionJSON"></context>
                        <item-list [items]="collectionJSON.items"></item-list>
                    </div>
                    
                </div>
              `
})
export class CollectionComponent {

    /**
     * An object that represents the current collection.
     */
    collection: Collection;

    /**
     * An object that represents the current collection.
     * TODO collectionJSON should be removed, I introduced it because the tree component was written to work with the JSON directly, and I didn't have the time to make it work with Collection objects
     */
    collectionJSON: any;


    items : Item[];
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
                private breadcrumb: BreadcrumbService, 
                translate: TranslateService) {
        let page = params.get('page') ? params.get('page') : 1;
        directory.loadObj('collection', params.get('id'), page).then(collectionJSON => { // for some reason the collectionJSON is not completed yet?
            this.collectionJSON = collectionJSON;
            breadcrumb.visit(this.collectionJSON);
            this.collection = new Collection(this.collectionJSON); // Need to find a better way to deal with this.
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}

                    
                   