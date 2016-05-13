import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from './dspace/authorization/services/authorization.service';
import { DSpaceDirectory } from './dspace/dspace.directory';

import { BreadcrumbComponent } from './navigation/components/breadcrumb.component';
import { CollectionComponent } from './dspace/components/collection.component';
import { CollectionCreateComponent } from './dspace/components/collection-create.component';
import { CommunityComponent } from './dspace/components/community.component';
import { CommunityCreateComponent } from './dspace/components/community-create.component';
import { ContextComponent } from './navigation/components/context.component';
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
import { SidebarService } from './utilities/services/sidebar.service';
import { SidebarSection } from './dspace/models/sidebar-section.model';

import { User } from './dspace/models/user.model';

/**
 * The main app component. Layout with navbar, breadcrumb, and router-outlet.
 * This component is server-side rendered and either replayed or hydrated on client side.
 * Also, defines the parent routes.
 */
@Component({
    selector: 'dspace',
    directives: [ ROUTER_DIRECTIVES,
                  BreadcrumbComponent,
                  ContextComponent,
                  LoginModalComponent,
                  NotificationComponent, SidebarComponent
                ],
    
    pipes: [ TranslatePipe ],
    template: `
                <nav class="navbar navbar-inverse">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span> 
                            </button>
                            <a class="navbar-brand" [routerLink]="['/Home']">{{ 'header.repository-name' | translate }}</a>
                        </div>
                        <div class="collapse navbar-collapse" id="myNavbar">
                            <ul class="nav navbar-nav">
                                <li><a [routerLink]="['/Dashboard']">{{ 'header.dashboard' | translate }}</a></li>
                            </ul>
                            <ul class="nav navbar-nav navbar-right" *ngIf="!user">
                                <li><a [routerLink]="['/Register']"><span class="glyphicon glyphicon-user space-right"></span>{{ 'header.register' | translate }}</a></li>
                                <li><a (click)="login.openLoginModal()" class="clickable"><span class="glyphicon glyphicon-log-in space-right"></span>{{ 'header.login' | translate }}</a></li>
                            </ul>
                            <ul class="nav navbar-nav navbar-right" *ngIf="user">
                                <li><a [routerLink]="['/Home']"><span class="glyphicon glyphicon-user space-right"></span>{{ user.fullname }}</a></li>
                                <li><a (click)="logout()" class="clickable"><span class="glyphicon glyphicon-log-out space-right"></span>{{ 'header.logout' | translate }}</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                
                <breadcrumb></breadcrumb>
                <div class="container">
                    <div class="col-md-4">
                        <context></context>
                        <sidebar></sidebar>
                    </div>
                    <div class="col-md-8">
                        <notification [channel]="channel"></notification>
                        <router-outlet></router-outlet>
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

        { path: '/**', redirectTo: [ '/Dashboard' ] }
])
export class AppComponent implements OnInit {

    /**
     * Notification channel.
     */
    private channel: string = "app";

    /**
     * Logged in user.
     */
    private user: User;

    /**
     *
     * @param dspace
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param translate 
     *      TranslateService
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(private dspace: DSpaceDirectory,
                private authorization: AuthorizationService,
                private translate: TranslateService,
                private router: Router,
                private sidebarService : SidebarService) {

                    this.user = authorization.user;

                    authorization.userObservable.subscribe(user => {
                        this.user = user;
                    });

                    translate.setDefaultLang('en');
                    translate.use('en');
    }

    /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit() {
        this.dspace.loadDirectory();
        this.populateStandardSidebar();
    }

    /**
     * Logout.
     */
    private logout(): void {
        this.authorization.logout();
        this.router.navigate(['/Dashboard']);
    }


    /**
     * Fills the sidebar with some standard components.
     */
    populateStandardSidebar()
    {
        let builder = SidebarSection.getBuilder();
        let aboutComponent = builder.name("About").route("Home").id("about").index(35).build();
        builder.resetBuild();
        let helpComponent = builder.name("sidebar.help.header").id("helpheader").index(0).addChild(aboutComponent).visible(true).build();
        this.sidebarService.addSection(helpComponent);
        // login component
        builder = SidebarSection.getBuilder();
        let loginComponent = builder.name("sidebar.account.login").route("Login").build();
        builder.resetBuild();
        let registerComponent = builder.name("sidebar.account.register").route("Home").visible(true).build();
        builder.resetBuild();
        let logoutComponent = builder.name("sidebar.account.logout").route("Home").id("account-logout").build();
        builder.resetBuild();
        let accountComponent = builder.name("sidebar.account.header").addChild(loginComponent).addChild(registerComponent).addChild(logoutComponent).id("my-account").build();
        this.sidebarService.addSection(accountComponent);


        this.sidebarService.changeVisibility("account-logout",false);

    }
}
