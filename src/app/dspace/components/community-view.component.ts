import { Component } from '@angular/core';
import { RouteConfig, RouterOutlet, RouteParams } from '@angular/router-deprecated';

import { DSpaceDirectory } from '../dspace.directory';
import { Community } from "../models/community.model";
import { ContextProviderService } from '../services/context-provider.service';
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';

import { TreeComponent } from '../../navigation/components/tree.component';
import { ContainerHomeComponent } from "./container-home.component.ts";

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
export class CommunityViewComponent {

    /**
     * An object that represents the current community.
     */
    private community: Community;

    /**
     *
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     */
    constructor(private contextProvider: ContextProviderService) {
        this.community = contextProvider.context;
        contextProvider.contextObservable.subscribe(currentContext => {
            this.community = currentContext;
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
