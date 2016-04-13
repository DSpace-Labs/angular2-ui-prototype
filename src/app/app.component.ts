import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {BreadcrumbComponent} from './navigation/breadcrumb.component';

import {HomeComponent} from './home.component';
import {LoginComponent} from './login.component';
import {RegisterComponent} from './register.component';
import {DashboardComponent} from './dashboard.component';
import {SettingsComponent} from './settings.component';
import {SetupComponent} from './setup.component';

import {CommunityComponent} from './dspace/components/community.component';
import {CollectionComponent} from './dspace/components/collection.component';
import {SimpleItemViewComponent} from './dspace/components/simple-item-view.component';
import {FullItemViewComponent} from './dspace/components/full-item-view.component';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * The main app component. Layout with navbar, breadcrumb, and router-outlet.
 * This component is server-side rendered and either replayed or hydrated on client side.
 * Also, defines the parent routes.
 */
@Component({
    selector: 'dspace',
    directives: [ROUTER_DIRECTIVES, BreadcrumbComponent],
    styles: [],
    pipes: [TranslatePipe],
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
                                <li><a [routerLink]="['/Home']">{{ 'header.home' | translate }}</a></li>
                                <li><a [routerLink]="['/Dashboard']">{{ 'header.dashboard' | translate }}</a></li>
                            </ul>
                            <ul class="nav navbar-nav navbar-right">
                                <li><a [routerLink]="['/Register']"><span class="glyphicon glyphicon-user space-right"></span>{{ 'header.register' | translate }}</a></li>
                                <li><a [routerLink]="['/Login']"><span class="glyphicon glyphicon-log-in space-right"></span>{{ 'header.login' | translate }}</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <breadcrumb></breadcrumb>
                <router-outlet></router-outlet>
              `
})
@RouteConfig([
    
        { path: "/home", name: "Home", component: HomeComponent, useAsDefault: true },
        { path: "/", name: "Dashboard", component: DashboardComponent },
        { path: "/communities/:id", name: "Communities", component: CommunityComponent },
        { path: "/collections/:id", name: "Collections", component: CollectionComponent },
        { path: "/items/:id", name: "Items", component: SimpleItemViewComponent },
        { path: "/settings", name: "Settings", component: SettingsComponent },
        { path: "/setup", name: "Setup", component: SetupComponent },
        { path: "/register", name: "Register", component: RegisterComponent },
        { path: "/login", name: "Login", component: LoginComponent },
        { path: "/items/:id/full", name:"FullItemView", component: FullItemViewComponent}

])
export class AppComponent {

    constructor(translate: TranslateService) {
        console.log('Starting App!');
        translate.setDefaultLang('en');
        translate.use('en');
    }

}