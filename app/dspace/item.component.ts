import {Component, View} from 'angular2/core';

import {BreadcrumbComponent} from './breadcrumb.component';

import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'dspace-object'
})
@View({
    directives: [BreadcrumbComponent],
    template: `
                <div class="container">
                    <breadcrumb></breadcrumb>
                    <h1>Item</h1>
                </div>
              `
})
export class ItemComponent {

    item: any;

    constructor(private breadcrumbService: BreadcrumbService) {
        this.item = this.breadcrumbService.getBreadcrumb();
    }

}