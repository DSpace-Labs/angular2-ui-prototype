import {Component, View} from 'angular2/core';
import {Router} from 'angular2/router';

import {TreeComponent} from './tree.component';

import {BreadcrumbComponent} from './breadcrumb.component';

import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'dspace-object'
})
@View({
    directives: [BreadcrumbComponent, TreeComponent],
    template: ` 
                <div class="container">
                    <breadcrumb></breadcrumb>
                    <h2>Collection</h2>
                    <tree [directories]="collection"></tree>
                    <div *ngFor='#key of keys'>
                        <span>{{key}}</span>: <span>{{collection[0][key]}}</span>
                    </div>
                </div>
              `
})
export class CollectionComponent {

    collection: Array<Object>;
    keys: any;

    subscription: any;

    constructor(private breadcrumbService: BreadcrumbService) {
        this.setCollection(this.breadcrumbService.getBreadcrumb())
    }

    setCollection(collection) {
        this.collection = new Array<Object>();
        this.collection.push(collection);
        this.keys = Object.keys(this.collection[0]);
    }

    ngOnInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(context => {
            this.setCollection(context);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}