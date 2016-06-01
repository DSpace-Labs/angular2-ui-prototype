import { Inject, Injectable } from "@angular/core";
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { SidebarService } from './services/sidebar.service';
import { AuthorizationService } from '../dspace/authorization/services/authorization.service';
import { SidebarHelper } from './sidebar.helper';

/**
 * Class to populate the standard  sidebar.
 */

@Injectable()
export class AppSidebarHelper extends SidebarHelper
{


    /**
     *
     * @param sidebarService
     *      SidebarService is a singleton service to interact with our sidebar
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     */
    constructor(@Inject(SidebarService) sidebarService : SidebarService, @Inject(AuthorizationService) private authorization : AuthorizationService)
    {
        super(sidebarService); // super implements this as 'protected'
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
    }
}