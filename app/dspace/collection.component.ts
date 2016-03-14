import {Component, View} from 'angular2/core';

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
                </div>
              `
})
export class CollectionComponent {

    collection: Array<Object>;

    constructor(private breadcrumbService: BreadcrumbService) {
        this.collection = new Array<Object>();
        this.collection.push(this.breadcrumbService.getBreadcrumb());
    }

}