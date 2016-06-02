import { Inject, Injectable } from "@angular/core";
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { SidebarService } from './services/sidebar.service';
import { AuthorizationService } from '../dspace/authorization/services/authorization.service';
import { SidebarHelper } from './sidebar.helper';

import {HttpService} from "./services/http.service";

/**
 * Class to populate the standard  sidebar.
 */
@Injectable()
export class AppSidebarHelper extends SidebarHelper
{


    /**
     *
     * @param sidebarService
     *      SidebarService is a singleton service to interact with the sidebar and the components.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization
     * @param httpService
     *      HttpService is a singleton service to provide basic xhr requests
     */
    constructor(@Inject(SidebarService) sidebarService : SidebarService, @Inject(AuthorizationService) private authorization : AuthorizationService, @Inject(HttpService) private httpService : HttpService)
    {
        super(sidebarService); // super implements this as 'protected'
        this.readSidebarFromFile();
    }


    /**
     * Populate the sidebar with components that need to be shown on every page
     * This is the case as 'app' is our root.
     */
    populateSidebar()
    {


        this.isAuthenticated = this.authorization.isAuthenticated();


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
            .testFunction( () => {
                return !this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .build();

        // end test


        let registerComponent = SidebarSection.getBuilder()
            .name("sidebar.account.register")
            .route("404")
            .testFunction( () => {
                return !this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .build();

        let logoutComponent = SidebarSection.getBuilder()
            .name("sidebar.account.logout")
            .route("Logout")
            .id("account-logout")
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
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
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .build();

        this.sidebarService.addSection(adminSection);

    }

    /**
     * Reads the data in the sidebar file from the server.
     * Then it adds these sidebarsections (defined in json) to our SidebarService.
     * @returns {Promise<TResult>|Promise<U>}
     */
    readSidebarFromFile()
    {
        // write the custom sidebar sections to a file.
        // convert the sidebar to json.
        this.httpService.get({
           url : "http://localhost:3000/customsidebar"
        }).forEach(res => {
            // create a sidebarsection out of the result.
            // so we can use the normal comparison (full object) instead of only the ID in our filter methods.
            // Plus, we won't have random objects around the SidebarService which might give problems later on.
            for(let section of res){
                let buildSection = new SidebarSection(section);
                this.sidebarService.addSection(buildSection);
            }
        });
    }
}