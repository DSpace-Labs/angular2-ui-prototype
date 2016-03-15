import {Component, View} from 'angular2/core';
import {Router} from 'angular2/router';

import {BreadcrumbService} from './breadcrumb.service';

import {TreeComponent} from './tree.component';
import {ContextComponent} from './context.component';
import {BreadcrumbComponent} from './breadcrumb.component';

@Component({
    selector: 'dspace-object'
})
@View({
    directives: [ContextComponent, BreadcrumbComponent, TreeComponent],
    template: ` 
                <div class="container">
                    
                    <breadcrumb></breadcrumb>

                    <div class="col-md-4">
                        <context [context]="collection[0]"></context>
                    </div>

                    <div class="col-md-8">
                        <tree [directories]="collection"></tree>
                        <div class="jumbotron">
                            <div class="container">
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
              `
})
export class CollectionComponent {

    collection: Array<Object>;

    subscription: any;

    constructor(private breadcrumbService: BreadcrumbService) {
        this.setCollection(this.breadcrumbService.getBreadcrumb());
    }

    setCollection(collection) {
        this.collection = new Array<Object>();
        this.collection.push(collection);
    }

    ngOnInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(context => {
            if (context.type == 'collection') {
                this.setCollection(context);
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}