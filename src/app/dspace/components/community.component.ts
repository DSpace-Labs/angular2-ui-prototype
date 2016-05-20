import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

import { DSpaceHierarchyService } from '../services/dspace-hierarchy.service';
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';

import { ContainerHomeComponent } from "./container-home.component.ts";
import { TreeComponent } from '../../navigation/components/tree.component';

import { Community } from "../models/community.model";

/**
 * Community component for displaying the current community.
 * View contains sidebar context and tree hierarchy below current community.
 */
@Component({
    selector: 'community',
    directives: [ ContainerHomeComponent, TreeComponent ],
    template: `
                <div *ngIf="communityProvided()">
                    <container-home [container]="community"></container-home>
                    <tree [directories]="subCommunitiesAndCollections(community)"></tree>
                </div>
              `
})
export class CommunityComponent {

    /**
     * An object that represents the current community.
     */
    private community: Community;

    /**
     *
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     */
    constructor(private dspace: DSpaceHierarchyService, 
                private breadcrumb: BreadcrumbService,
                private params: RouteParams) {
        dspace.loadObj('community', params.get('id'), params.get('page'), params.get('limit')).then((community:Community) => {
            this.community = community;
            breadcrumb.visit(this.community);
        });
    }

    /**
     * Check if context provides a community.
     */
    private communityProvided(): boolean {
        return this.community && this.community.type == 'community';
    }

    /**
     *
     */
    private subCommunitiesAndCollections(community: any): Array<any> {
        return community.subcommunities.concat(community.collections);
    }

}
