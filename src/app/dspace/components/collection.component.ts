import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {TreeComponent} from '../../navigation/tree.component';
import {ContextComponent} from '../../navigation/context.component';

/**
 * 
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
     * 
     */
    collection: Object;

    /**
     * 
     */
    constructor(private params: RouteParams, private directory: DSpaceDirectory, private breadcrumb: BreadcrumbService) {
        console.log('Collection ' + params.get("id"));
        directory.loadObj('collection', params.get("id")).then(collection => {
            this.collection = collection;
            breadcrumb.visit(this.collection);
        });
    }

}

                    
                   