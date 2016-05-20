import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';
import { RouteSidebarSection } from '../dspace/models/sidebar/routesidebar-section.model';

/**
 * Class to populate the standard sidebar sidebar.
 */
export class AppSidebarHelper
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

        let aboutComponent = RouteSidebarSection.getBuilder()
            .name("About")
            .route("Home")
            .id("about")
            .build();

        let helpComponent = RouteSidebarSection.getBuilder()
            .name("sidebar.help.header")
            .id("helpheader")
            .index(100)
            .addChild(aboutComponent)
            .build();
        this.sidebarService.addSection(helpComponent);

        let loginComponent = RouteSidebarSection.getBuilder()
            .name("sidebar.account.login")
            .route("Login")
            .visible(true)
            .visibilityObservable(this.authorization.userObservable)
            .build();

        let registerComponent = RouteSidebarSection.getBuilder()
            .name("sidebar.account.register")
            .route("Home")
            .visible(true)
            .visibilityObservable(this.authorization.userObservable)
            .build();

        let logoutComponent = RouteSidebarSection.getBuilder()
            .name("sidebar.account.logout")
            .route("Home")
            .id("account-logout")
            .visible(false)
            .visibilityObservable(this.authorization.userObservable)
            .build();

        let accountComponent = RouteSidebarSection.getBuilder()
            .name("sidebar.account.header")
            .addChildren([loginComponent,registerComponent,logoutComponent])
            .id("my-account")
            .build();

        this.sidebarService.addSection(accountComponent);

        // build submissions
        let createSubmissionComponent = RouteSidebarSection.getBuilder()
            .name("sidebar.submissions.submit")
            .route("Home")
            .build();


        let submissionComponent = RouteSidebarSection.getBuilder()
            .name('sidebar.submissions.header')
            .id('submissions')
            .visible(false)
            .visibilityObservable(this.authorization.userObservable)
            .addChild(createSubmissionComponent)
            .build(); // need to change this visibility depending on the authorization service

        this.sidebarService.addSection(submissionComponent);

        let createComComponent = RouteSidebarSection.getBuilder()
            .name("sidebar.context-dashboard.create-community")
            .id("createcommunity")
            .route("CommunityCreate")
            .build();


        let contextComponent = RouteSidebarSection.getBuilder()
            .name("sidebar.context-dashboard.header")
            .id("appcontext")
            .visible(false)
            .visibilityObservable(this.authorization.userObservable)
            .addChild(createComComponent)
            .build();

        this.sidebarService.addSection(contextComponent);

        // we only push this one, because this one is the only one that needs to get deleted when we navigate away.
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