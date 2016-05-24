import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';

/**
 * Class to populate the dashboard sidebar.
 */
export class DashboardSidebarHelper
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
     * @param authorization
     */
    constructor(private sidebarService : SidebarService, private authorization? : any)
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
            .visible(false)
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