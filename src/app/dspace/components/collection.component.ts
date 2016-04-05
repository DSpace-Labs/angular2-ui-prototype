import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {TreeComponent} from '../../navigation/tree.component';
import {ContextComponent} from '../../navigation/context.component';

/**
 * Collection component for displaying the current collection.
 * View contains sidebar context and tree hierarchy below current collection.
 */
@Component({
    selector: 'collection',
    directives: [TreeComponent, ContextComponent],
    template: ` 
                <div class="container" *ngIf="collection">

                    <div class="col-md-4">
                        <context [context]="collection"></context>
                    </div>  
                    
                    <div class="col-md-8">
                        <tree [directories]="collection.items"></tree>
                        <div class="jumbotron">
                            <div class="container">
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
              `
})
export class CollectionComponent {

    /**
     * An object that represents the current collection.
     *
     * TODO: replace object with inheritance model. e.g. collection extends dspaceObject
     */
    collection: Object;

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
        console.log('Collection ' + params.get("id"));
        directory.loadObj('collection', params.get("id")).then(collection => {
            this.collection = collection;
            breadcrumb.visit(this.collection);
        });
    }

}

                    
                   