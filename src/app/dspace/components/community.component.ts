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
                        <tree [directories]="community.subcommunities.concat(community.collections)"></tree>
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
    
    constructor(private params: RouteParams, private directory: DSpaceDirectory, private breadcrumb: BreadcrumbService) {
        console.log('Community ' + params.get("id"));
        directory.loadObj('community', params.get("id")).then(community => {
            this.community = community;
            breadcrumb.visit(this.community);
        });
    }

}

                       