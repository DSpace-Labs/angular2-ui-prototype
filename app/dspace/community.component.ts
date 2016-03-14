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
                    <h1>Community</h1>
                    <tree [directories]="community"></tree>
                    <div *ngFor='#key of keys'>
                        <span>{{key}}</span>: <span>{{community[0][key]}}</span>
                    </div>
                </div>
              `
})
export class CommunityComponent {

    community: Array<Object>;
    keys: any;

    subscription: any;

    constructor(private breadcrumbService: BreadcrumbService) {
        this.setCommunity(this.breadcrumbService.getBreadcrumb());
    }

    setCommunity(community) {
        this.community = new Array<Object>();
        this.community.push(community);
        this.keys = Object.keys(this.community[0]);
    }

    ngOnInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(context => {
            this.setCommunity(context);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}