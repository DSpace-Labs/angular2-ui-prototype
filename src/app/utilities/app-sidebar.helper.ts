import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';

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

        let otherComponent = SidebarSection.getBuilder().name("sidebar-test").id("testid").route("Home").visible(true).build();

        let loginComponent = SidebarSection.getBuilder()
            .name("sidebar.account.login")
            .route("Login")
            .visible(true)
            .addChild(otherComponent)
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


    }


    /**
     * This should not remove anything at the moment, because the sidebar gets populated with standard components in the app-component.
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }


}