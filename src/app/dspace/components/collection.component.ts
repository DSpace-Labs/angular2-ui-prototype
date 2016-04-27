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

                    <div class="col-md-4">
                        <context [context]="collection"></context>
                    </div>  
                    
                    <div class="col-md-8">
                        <container-home [container]=collection></container-home>
                        <item-list *ngIf="collection.items.length>0" [collection]="collection"></item-list>
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
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param directory
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param translate
     *      TranslateService
     */
    constructor(private params: RouteParams, 
                private directory: DSpaceDirectory, 
                private breadcrumb: BreadcrumbService, 
                translate: TranslateService) {
        directory.loadObj('collection', params.get('id'), params.get('page'), params.get('limit')).then((collection:Collection) => {
            this.collection = collection;
            breadcrumb.visit(this.collection);
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}

                    
                   