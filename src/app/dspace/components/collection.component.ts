import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {TreeComponent} from '../../navigation/tree.component';
import {ContextComponent} from '../../navigation/context.component';
import {ContainerHomeComponent} from "./container-home.component";
import {Collection} from "../models/collection.model";

/**
 *
 */
@Component({
    selector: 'collection',
    directives: [TreeComponent, ContextComponent, ContainerHomeComponent],
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
     *
     */
    collection: Collection;
    //TODO collectionJSON should be removed, I introduced it because the tree component was written to work with the JSON directly, and I didn't have the time to make it work with Collection objects
    collectionJSON: Object;

    /**
     *
     */
    constructor(private params: RouteParams, private directory: DSpaceDirectory, private breadcrumb: BreadcrumbService) {
        console.log('Collection ' + params.get("id"));
        directory.loadObj('collection', params.get("id")).then(collectionJSON => {
            this.collectionJSON = collectionJSON;
            this.collection = new Collection(collectionJSON);
            breadcrumb.visit(this.collectionJSON);
        });
    }

}

                    
                   