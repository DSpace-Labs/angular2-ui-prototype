import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {TreeComponent} from '../../navigation/tree.component';
import {ContextComponent} from '../../navigation/context.component';
import {ContainerHomeComponent} from "./container-home.component";
import {Collection} from "../models/collection.model";

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * Collection component for displaying the current collection.
 * View contains sidebar context and tree hierarchy below current collection.
 */
@Component({
    selector: 'collection',
    directives: [TreeComponent, ContextComponent, ContainerHomeComponent],
    pipes: [TranslatePipe],
    template: ` 
                <div class="container" *ngIf="collection">

                    <div class="col-md-4">
                        <context [context]="collectionJSON"></context>
                    </div>  
                    
                    <div class="col-md-8">
                        <container-home [container]=collection></container-home>
                        <tree [directories]="collectionJSON.items"></tree>
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
    constructor(private params: RouteParams, private directory: DSpaceDirectory, private breadcrumb: BreadcrumbService, translate: TranslateService) {
        console.log('Collection ' + params.get("id"));
        directory.loadObj('collection', params.get("id")).then(collectionJSON => {
            this.collectionJSON = collectionJSON;
            this.collection = new Collection(collectionJSON);
            breadcrumb.visit(this.collectionJSON);
        });

        translate.setDefaultLang('en');
        translate.use('en');
    }

}

                    
                   