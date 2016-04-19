import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {Collection} from "../models/collection.model";

import {ListComponent} from '../../navigation/list.component';
import {ContextComponent} from '../../navigation/context.component';
import {ContainerHomeComponent} from "./container-home.component";
import {PaginationComponent} from '../../navigation/pagination.component';

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
                        <context [context]="collectionJSON"></context>
                        <item-list [items]="collection.items"></item-list>
                    </div>  
<!--
                    <div class="col-md-8">
                        <container-home [container]=collection></container-home>
                       <list [collection]="collectionJSON"></list>
                    </div>
-->


                </div>
              `
})
export class CollectionComponent {

    /**
     * An object that represents the current collection.
     */
    collection: Object;

    /**
     * An object that represents the current collection.
     * TODO collectionJSON should be removed, I introduced it because the tree component was written to work with the JSON directly, and I didn't have the time to make it work with Collection objects
     */
    collectionJSON: Object;


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

        directory.loadObj('collection', params.get('id'), page).then(collectionJSON => {
            this.collectionJSON = collectionJSON;
            setTimeout( () => {
                this.collection = new Collection(collectionJSON);
                console.log(this.collection); // okay so basically, I need to create the collection later.
            },5000) // this timeout somehow fixes the loading issue.

            breadcrumb.visit(this.collectionJSON);
        });

        translate.setDefaultLang('en');
        translate.use('en');
    }

    ngOnInit()
    {
        console.log("after init");
        console.log(JSON.stringify(this.collectionJSON));
    }


    ngOnChanges()
    {
        console.log("on changes");
        this.collection = new Collection(this.collectionJSON);
    }





}

                    
                   