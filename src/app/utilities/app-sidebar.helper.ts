import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';
import { AuthorizationService } from '../dspace/authorization/services/authorization.service';

/**
 * Class to populate the standard  sidebar.
 */
export class AppSidebarHelper
{

    /**
     * The sections contained in the current component
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
     *      SidebarService is a singleton service to interact with our sidebar
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     */
    constructor(private sidebarService : SidebarService, private authorization? : AuthorizationService)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }


    /**
     * Populate the sidebar with components that need to be shown on every page
     * This is the case as 'app' is our root.
     */
    populateSidebar()
    {

        if(this.authorization != null)
        {
            this.isAuthenticated = this.authorization.isAuthenticated();
        }

        /*
        let aboutComponent = SidebarSection.getBuilder()
            .name("About")
            .route("Home")
            .id("about")
            .build();

        let helpComponent = SidebarSection.getBuilder()
            .name("sidebar.help.header")
            .id("helpheader")
            .addChild(aboutComponent)
            .build();
        this.sidebarService.addSection(helpComponent);
        */
        //let otherComponent = SidebarSection.getBuilder().name("sidebar-test").id("testid").route("Home").visible(true).build(); test another level of indentation

        let loginComponent = SidebarSection.getBuilder()
            .name("sidebar.account.login")
            .route("Login")
            .visible(true)
            .visibilityObservable(this.authorization.userObservable)
            .build();


        let registerComponent = SidebarSection.getBuilder()
            .name("sidebar.account.register")
            .route("Home")
            .visible(true)
            .visibilityObservable(this.authorization.userObservable)
            .build();

        let logoutComponent = SidebarSection.getBuilder()
            .name("sidebar.account.logout")
            .route("Logout")
            .id("account-logout")
            .visible(false)
            .visibilityObservable(this.authorization.userObservable)
            .build();


        let accountComponent = SidebarSection.getBuilder()
            .name("sidebar.account.header")
            .addChildren([loginComponent,registerComponent,logoutComponent])
            .id("my-account")
            .index(0) // show this as the first component
            .build();

        this.sidebarService.addSection(accountComponent);


        /* option to style the sidebar, this should only be visible to admins in the future */

        let sidebarEditSection = SidebarSection.getBuilder()
            .name("sidebar.context-admin.alter-sidebar")
            .id("alter-sidebar")
            .route("AdminSidebar")
            .build();

        let adminSection = SidebarSection.getBuilder()
            .name("sidebar.context-admin.header")
            .id("alter-sidebar-heading")
            .addChild(sidebarEditSection)
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .build();

        this.sidebarService.addSection(adminSection);

    }


    /**
     * This should not remove anything at the moment, because the sidebar gets populated with standard components in the app-component.
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }


}