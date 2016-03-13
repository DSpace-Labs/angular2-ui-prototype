import {Component, View} from 'angular2/core';

import {DirectoryComponent} from './directory.component';
import {BreadcrumbComponent} from './breadcrumb.component';

@Component({
    selector: 'dspace-object'
})
@View({
    directives: [BreadcrumbComponent, DirectoryComponent],
    template: ` 
                <div class="container">
                    <breadcrumb></breadcrumb>
                    <h2>Collection</h2>
                    <directory></directory>
                </div>
              `
})
export class CollectionComponent {
    
    constructor() {

    }

    ngAfterViewInit() {

    }

}