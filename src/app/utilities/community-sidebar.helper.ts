import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Community } from '../dspace/models/community.model';
import { SidebarService } from './services/sidebar.service';

import { AuthorizationService } from '../dspace/authorization/services/authorization.service';


/**
 * Class to populate the sidebar on community pages.
 */
export class CommunitySidebarHelper
{

    /**
     *
     */
    sections : Array<SidebarSection>;

    /**
     *
     * @type {boolean}
     */
    isAuthenticated : boolean = false;

    /**
     *
     * @param sidebarService
     *       SidebarService is a singleton service to interact with our sidebar
     * @param community
     *       Community is the current community that has added this sidebar
     *       We want this community to provide the ID to the RouteParams.
     * @param authorization
     *       AuthorizationService is a singleton service to interact with the authorization service.
     */
    constructor(private sidebarService : SidebarService, private community : Community, private authorization? : AuthorizationService)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }


    /**
     * The community sidebar
     *
     */
    populateSidebar()
    {

        if(this.authorization != null)
        {
            this.isAuthenticated = this.authorization.isAuthenticated();
        }

        let browseChildSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.edit")
            .route("E404")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .build();

        let createCommunity = SidebarSection.getBuilder()
            .name("sidebar.context-community.create-community")
            .route("CommunityCreate")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .build();

        let createCollection = SidebarSection.getBuilder()
            .name("sidebar.context-community.create-collection")
            .route("CollectionCreate")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .build();

        let communitySection = SidebarSection.getBuilder()
            .name("sidebar.context-community.header")
            .id("context-collection")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .addChildren([browseChildSection,createCollection,createCommunity])
            .build();
        this.sidebarService.addSection(communitySection);
        this.sections.push(communitySection);
    }


    /**
     *
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }
}