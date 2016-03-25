import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {TreeComponent} from '../../navigation/tree.component';
import {ContextComponent} from '../../navigation/context.component';

@Component({
    selector: 'collection',
    directives: [TreeComponent, ContextComponent],
    template: ` 
                <div class="container" *ngIf="collection">

                    <div class="col-md-4">
                        <context [context]="collection"></context>
                    </div>  
                    
                    <div class="col-md-8">
                        <tree [directories]="collection.list"></tree>
                        <div class="jumbotron">
                            <div class="container">
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
              `
})
export class CollectionComponent {

    collection: Object;

    constructor(private params: RouteParams, private dspace: DSpaceDirectory, private breadcrumb: BreadcrumbService) {
        console.log('Collection ' + params.get("id"));
        dspace.collection.subscribe(collection => {
            this.collection = collection;
            breadcrumb.visit(this.collection);
        })
    }

    ngOnInit() {
        this.dspace.loadCollection(this.params.get("id"));
    }

}

                    
                   