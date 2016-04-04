import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {TreeComponent} from '../../navigation/tree.component';
import {ContextComponent} from '../../navigation/context.component';
import {Community} from "../models/community.model";
import {ContainerHomeComponent} from "./container-home.component.ts";

/**
 *
 */
@Component({
    selector: 'community',
    directives: [TreeComponent, ContextComponent, ContainerHomeComponent],
    template: ` 
                <div class="container" *ngIf="community">
                    
                    <div class="col-md-4">
                        <context [context]="communityJSON"></context>
                    </div>     
                    
                    <div class="col-md-8">
                        <container-home [container]=community></container-home>
                        <tree [directories]="communityJSON.subcommunities.concat(communityJSON.collections)"></tree>
                    </div>                          
                    
                </div>
              `
})
export class CommunityComponent {

    /**
     *
     */
    community: Community;
    //TODO communityJSON should be removed, I introduced it because the tree component was written to work with the JSON directly, and I didn't have the time to make it work with Community objects
    communityJSON: Object;

    /**
     *
     */
    constructor(private params: RouteParams, private directory: DSpaceDirectory, private breadcrumb: BreadcrumbService) {
        console.log('Community ' + params.get("id"));
        directory.loadObj('community', params.get("id")).then(communityJSON => {
            this.communityJSON = communityJSON;
            this.community = new Community(communityJSON);
            breadcrumb.visit(this.communityJSON);
        });
    }

}

                       