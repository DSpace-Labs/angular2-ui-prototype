import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar-section.model';
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
     * @param sidebarService
     */
    constructor(private sidebarService : SidebarService)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }


    /**
     * The visibility is bound the the authorizationservice
     */
    populateSidebar(userObservable : any)
    {

        let aboutComponent = SidebarSection.getBuilder()
            .name("About")
            .route("Home")
            .id("about")
            .build();

        let helpComponent = SidebarSection.getBuilder()
            .name("sidebar.help.header")
            .id("helpheader")
            .index(100)
            .addChild(aboutComponent)
            .build();
        this.sidebarService.addSection(helpComponent);

        let loginComponent = SidebarSection.getBuilder()
            .name("sidebar.account.login")
            .route("Login")
            .visible(true)
            .visibilityObservable(userObservable)
            .build();

        let registerComponent = SidebarSection.getBuilder()
            .name("sidebar.account.register")
            .route("Home")
            .visible(true)
            .visibilityObservable(userObservable)
            .build();

        let logoutComponent = SidebarSection.getBuilder()
            .name("sidebar.account.logout")
            .route("Home")
            .id("account-logout")
            .visible(false)
            .visibilityObservable(userObservable)
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
            .visible(false)
            .visibilityObservable(userObservable)
            .addChild(createSubmissionComponent)
            .build(); // need to change this visibility depending on the authorization service

        this.sidebarService.addSection(submissionComponent);

        let createComComponent = SidebarSection.getBuilder()
            .name("sidebar.context-dashboard.create-community")
            .id("createcommunity")
            .route("Home")
            .build();


        let contextComponent = SidebarSection.getBuilder()
            .name("sidebar.context-dashboard.header")
            .id("appcontext")
            .visible(false)
            .visibilityObservable(userObservable)
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
        console.log("running the remove..");
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }


}