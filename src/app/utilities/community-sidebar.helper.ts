import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Community } from '../dspace/models/community.model';
import { SidebarService } from './services/sidebar.service';


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
     * @param community
     * @param userObservable
     */
    constructor(private sidebarService : SidebarService, private community : Community, private authorization? : any)
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
        let homeChildSection =  SidebarSection.getBuilder()
            .name("sidebar.context-community.view")
            .route("Communities",{id : this.community.id})
            .build();

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
            .addChildren([homeChildSection,browseChildSection,createCollection,createCommunity])
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