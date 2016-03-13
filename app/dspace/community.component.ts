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
                    <h1>Community</h1>
                    <directory></directory>
                </div>
              `
})
export class CommunityComponent {
        
    constructor() {

    }

    ngAfterViewInit() {

    }

}