import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {TreeComponent} from '../../navigation/tree.component';
import {ContextComponent} from '../../navigation/context.component';

@Component({
    selector: 'community',
    directives: [TreeComponent, ContextComponent],
    template: ` 
                <div class="container" *ngIf="community">
                    
                    <div class="col-md-4">
                        <context [context]="community"></context>
                    </div>     
                    
                    <div class="col-md-8">
                        <tree [directories]="community.list"></tree>
                        <div class="jumbotron">
                            <div class="container">
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
              `
})
export class CommunityComponent {

    community: Object;
    
    constructor(private params: RouteParams, private dspace: DSpaceDirectory, private breadcrumb: BreadcrumbService) {
        console.log('Community ' + params.get("id"));
        dspace.community.subscribe(community => {
            this.community = community;
            breadcrumb.visit(this.community);
        })
    }

    ngOnInit() {
        this.dspace.loadCommunity(this.params.get("id"));
    }

}

                       