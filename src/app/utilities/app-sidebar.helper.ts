import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';


/**
 * Class to populate the sidebar on item-view pages.
 */
export class AppSidebarHelper
{

    /**
     *
     */
    sections : Array<SidebarSection>;

    /**
     *
     * @param sidebarService
     */
    constructor(private sidebarService : SidebarService)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }


    /**
     *
     */
    populateSidebar()
    {
        let aboutComponent = SidebarSection.getBuilder()
            .name("About")
            .route("Home")
            .id("about")
            .build();

        let helpComponent = SidebarSection.getBuilder()
            .name("sidebar.help.header")
            .id("helpheader")
            .index(0)
            .addChild(aboutComponent)
            .build();
        this.sidebarService.addSection(helpComponent);

        let loginComponent = SidebarSection.getBuilder()
            .name("sidebar.account.login")
            .route("Login")
            .build();

        let registerComponent = SidebarSection.getBuilder()
            .name("sidebar.account.register")
            .route("Home")
            .build();

        let logoutComponent = SidebarSection.getBuilder()
            .name("sidebar.account.logout")
            .route("Home")
            .id("account-logout")
            .visible(false)
            .build();

        let accountComponent = SidebarSection.getBuilder()
            .name("sidebar.account.header")
            .addChildren([loginComponent,registerComponent,logoutComponent])
            .id("my-account")
            .build();

        this.sidebarService.addSection(accountComponent);

        // build submissions
        let createSubmissionComponent = SidebarSection.getBuilder()
            .name("sidebar.submissions.submit")
            .route("Home")
            .build();

        let submissionComponent = SidebarSection.getBuilder()
            .name('sidebar.submissions.header')
            .id('submissions')
            .addChild(createSubmissionComponent)
            .build(); // need to change this visibility depending on the authorization service
        this.sidebarService.addSection(submissionComponent);
    }


    /**
     *  Normally does not get called as this component contains the default sidebar entries
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }
}