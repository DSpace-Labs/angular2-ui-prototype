import { Component, OnInit, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";
import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';

import { AuthorizationService } from './dspace/authorization/services/authorization.service';
import { DSpaceHierarchyService } from './dspace/services/dspace-hierarchy.service';

import { BreadcrumbComponent } from './navigation/components/breadcrumb.component';
import { CollectionComponent } from './dspace/components/collection.component';
import { CollectionCreateComponent } from './dspace/components/collection-create.component';
import { CommunityComponent } from './dspace/components/community.component';
import { CommunityCreateComponent } from './dspace/components/community-create.component';
import { LogoutComponent } from './dspace/components/logout.component';
import { PageNotFoundComponent } from './dspace/components/pagenotfound.component.ts';

import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home.component';
import { ItemComponent } from './dspace/components/item.component';
import { ItemCreateComponent } from './dspace/components/item-create.component';
import { LoginModalComponent } from './dspace/authorization/login/login-modal.component';
import { LoginFormComponent } from './dspace/authorization/login/login-form.component';
import { NotificationComponent } from './utilities/notification/notification.component';
import { RegistrationComponent } from './dspace/authorization/registration/registration.component';
import { SettingsComponent } from './settings.component';
import { SetupComponent } from './setup.component';

import { SidebarComponent } from './dspace/components/sidebar/sidebar.component';

import { AppSidebarHelper } from './utilities/app-sidebar.helper';

/**
 * The main app component. Layout with navbar, breadcrumb, and router-outlet.
 * This component is server-side rendered and either replayed or hydrated on client side.
 * Also, defines the parent routes.
 */
@Component({
    selector: 'dspace',
    directives: [ ROUTER_DIRECTIVES,
                  CollapseDirective,
                  BreadcrumbComponent,
                  LoginModalComponent,
                  NotificationComponent,
                  SidebarComponent
                ],
    providers : [AppSidebarHelper],
    pipes: [ TranslatePipe ],
    template: `
                <!--TODO separate out header-->
                <div class="container-fluid">
                    <div class="row no-gutter">
                        <div class="hidden-xs hidden-sm col-md-4 col-lg-3">
                            <sidebar></sidebar>
                        </div>
                        <div class="col-md-8 col-lg-9 sticky-footer-wrapper">
                            <div class="sticky-footer-everything-else">
                                <header>
                                    <nav class="navbar navbar-inverse">
                                        <div class="container-fluid content-container-fluid">
                                            <div>
                                                <a class="navbar-brand" [routerLink]="['/Home']">{{
                                                    'header.repository-name' | translate }}</a>
                                            </div>
                                        </div>
                                    </nav>
                                </header>
                                <div class="container-fluid content-container-fluid">
                                    <breadcrumb></breadcrumb>
                                    <main>
                                        <notification [channel]="channel"></notification>
                                        <router-outlet></router-outlet>
                                    </main>
                                    <!--TODO separate out footer-->
                                    <footer>
                                        <div class="container-fluid content-container-fluid">
                                            <!-- <div class="row">
                                                <div class="col-sm-offset-4 col-lg-offset-3"> -->
                                                    <p>
                                                        <a href="http://www.dspace.org/">{{"footer.link.dspace" | translate}}</a>
                                                        {{"footer.copyright" | translate}}
                                                        <a href="http://www.duraspace.org/">{{"footer.link.duraspace" | translate}}</a>
                                                    </p>
                                                <!-- </div>
                                            </div> -->
                                        </div>
                                    </footer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <login-modal #login></login-modal>
              `
})
@RouteConfig([

        { path: "/home", name: "Home", component: HomeComponent, useAsDefault: true },
        { path: "/settings", name: "Settings", component: SettingsComponent },
        { path: "/setup", name: "Setup", component: SetupComponent },
        { path: "/login", name: "Login", component: LoginFormComponent },
        { path: "/register", name: "Register", component: RegistrationComponent },

        { path: "/", name: "Dashboard", component: DashboardComponent },
        { path: "/communities/:id", name: "Communities", component: CommunityComponent },
        { path: "/collections/:id", name: "Collections", component: CollectionComponent },
        { path: "/items/:id/...", name: "Items", component: ItemComponent },

        { path: "/create-community", name: "CommunityCreate", component: CommunityCreateComponent },
        { path: "/create-collection", name: "CollectionCreate", component: CollectionCreateComponent },
        { path: "/create-item", name: "ItemCreate", component: ItemCreateComponent },

        { path: "/logout", name: "Logout", component: LogoutComponent},

        { path: "/404", name: "404", component: PageNotFoundComponent},

        { path: '/**', redirectTo: [ '/Dashboard' ] }
])
export class AppComponent implements OnInit {

    /**
     * Notification channel.
     */
    private channel: string = "app";

    /**
     * Is navbar collapsed?
     * Default to true so that navbar is hidden by default when window is resized.
     */
    private navCollapsed: boolean = true;

    /**
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param translate
     *      TranslateService
     * @param router
     *      Router is a singleton service provided by Angular2.
     * @param sidebarHelper
     *      SidebarHelper is a helper-class to inject the sidebar sections when the user visits this component
     */
     constructor(private dspace: DSpaceHierarchyService,
                private translate: TranslateService,
                private router: Router,
                @Inject(AppSidebarHelper)  sidebarHelper : AppSidebarHelper) {
                    translate.setDefaultLang('en');
                    translate.use('en');
                    sidebarHelper.populateSidebar();
    }

    /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit(){
        this.dspace.loadHierarchy();
    }
}
