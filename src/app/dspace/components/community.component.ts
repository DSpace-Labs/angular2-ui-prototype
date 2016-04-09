import {Component} from 'angular2/core';
import {RouteConfig, RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {Community} from "../models/community.model";

import {TreeComponent} from '../../navigation/tree.component';
import {ContextComponent} from '../../navigation/context.component';
import {ContainerHomeComponent} from "./container-home.component.ts";
import {PaginationComponent} from '../../navigation/pagination.component';

/**
 * Community component for displaying the current community.
 * View contains sidebar context and tree hierarchy below current community.
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
@RouteConfig([
    {path: '/', component: PaginationComponent, name: 'Pagination', useAsDefault: true },
    {path: '/:page', component: PaginationComponent, name: 'Pagination'}
])
export class CommunityComponent {


    /**
     * An object that represents the current community.
     */
    community: Community;

    /**
     * An object that represents the current community.
     *
     * TODO communityJSON should be removed, I introduced it because the tree component was written to work with the JSON directly, and I didn't have the time to make it work with Community objects
     */
    communityJSON: any;

    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param directory
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
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

                       