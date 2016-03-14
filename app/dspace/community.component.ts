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
                        <context [context]="community[0]"></context>
                    </div>

                    <div class="col-md-8">
                        <tree [directories]="community"></tree>
                        <div class="jumbotron">
                            <div class="container">
                                
                            </div>
                        </div>                        
                    </div>
                    
                </div>
              `
})
export class CommunityComponent {

    community: Array<Object>;

    subscription: any;

    constructor(private breadcrumbService: BreadcrumbService) {
        this.setCommunity(this.breadcrumbService.getBreadcrumb());
    }

    setCommunity(community) {
        this.community = new Array<Object>();
        this.community.push(community);
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