import { Inject, Injectable } from "@angular/core";
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { SidebarService } from './services/sidebar.service';
import { AuthorizationService } from '../dspace/authorization/services/authorization.service';
import { SidebarHelper } from './sidebar.helper';
import { Http, Response } from '@angular/http';

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
    constructor(@Inject(SidebarService) sidebarService : SidebarService, @Inject(AuthorizationService) private authorization : AuthorizationService, private http : Http)
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
            .route("Home")
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

        // to test the siebar builder.
        let atmireLink = SidebarSection.getBuilder().name("atmire").id("custom-sidebar-section.atmire").url("http://www.atmire.com").build();
        let customSection = SidebarSection.getBuilder().name("Resources").id("custom-sidebar-section").addChild(atmireLink).build();
        this.sidebarService.addSection(customSection);
    }

    // load the current sidebar.
    readSidebarFromFile()
    {
        // write the custom sidebar sections to a file.
        // convert the sidebar to json.
        return new Promise((resolve,reject) =>
        {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        //resolve(JSON.parse(xhr.response));
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("GET","http://localhost:3000/customsidebar",true);
            xhr.send();
        }).then(x =>{
            var customEntries = x as Array<SidebarSection>;
            // parse the manually and add them to the sidebarservice.
            for(let e of customEntries)
            {
                let sidebarE =  <SidebarSection> e;
                this.sidebarService.addSection(sidebarE);
            }

        });
    }
}