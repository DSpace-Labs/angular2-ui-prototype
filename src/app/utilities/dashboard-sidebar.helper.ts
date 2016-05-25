import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';
import { AuthorizationService } from '../dspace/authorization/services/authorization.service';

/**
 * Class to populate the dashboard sidebar.
 */
export class DashboardSidebarHelper
{

    /**
     * The sections added by the Dashboard page.
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
     * @param authorization
     *       AuthorizationService is a singleton service to interact with the authorization service.
     */
    constructor(private sidebarService : SidebarService, private authorization? : AuthorizationService)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }


    /**
     * The visibility is bound the the authorizationservice
     */
    populateSidebar()
    {

        if(this.authorization != null)
        {
            this.isAuthenticated = this.authorization.isAuthenticated();
        }

        let createComComponent = SidebarSection.getBuilder()
            .name("sidebar.context-dashboard.create-community")
            .id("createcommunity")
            .route("CommunityCreate")
            .build();


        let contextComponent = SidebarSection.getBuilder()
            .name("sidebar.context-dashboard.header")
            .id("appcontext")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .addChild(createComComponent)
            .build();

        this.sidebarService.addSection(contextComponent);
        this.sections.push(contextComponent);
    }


    /**
     *  Normally does not get called as this component contains the default sidebar entries
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }


}