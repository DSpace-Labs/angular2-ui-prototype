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
                    <h1>Community</h1>
                    <tree [directories]="community"></tree>
                </div>
              `
})
export class CommunityComponent {

    community: Array<Object>;
    
    constructor(private breadcrumbService: BreadcrumbService) {
        this.community = new Array<Object>();
        this.community.push(this.breadcrumbService.getBreadcrumb());
    }

}