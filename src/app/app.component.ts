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
import {ItemComponent} from './dspace/components/item.component';

@Component({
    selector: 'dspace',
    directives: [ROUTER_DIRECTIVES, BreadcrumbComponent],
    styles: [],
    template: `
                <nav class="navbar navbar-inverse">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span> 
                            </button>
                            <a class="navbar-brand" [routerLink]="['/Home']">TAMU DSpace UI</a>
                        </div>
                        <div class="collapse navbar-collapse" id="myNavbar">
                            <ul class="nav navbar-nav">
                                <li><a [routerLink]="['/Home']">Home</a></li>
                                <li><a [routerLink]="['/Dashboard']">Dashboard</a></li>
                            </ul>
                            <ul class="nav navbar-nav navbar-right">
                                <li><a [routerLink]="['/Register']"><span class="glyphicon glyphicon-user space-right"></span>Register</a></li>
                                <li><a [routerLink]="['/Login']"><span class="glyphicon glyphicon-log-in space-right"></span>Login</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <breadcrumb></breadcrumb>
                <router-outlet></router-outlet>
              `
})
@RouteConfig([
        { path: "/dashboard", name: "Dashboard", component: DashboardComponent, useAsDefault: true },
        { path: "/home", name: "Home", component: HomeComponent },
        { path: "/settings", name: "Settings", component: SettingsComponent },
        { path: "/setup", name: "Setup", component: SetupComponent },
        { path: "/register", name: "Register", component: RegisterComponent },
        { path: "/login", name: "Login", component: LoginComponent },
        { path: "/communities/...", name: "Communities", component: CommunityComponent },
        { path: "/collections/...", name: "Collections", component: CollectionComponent },
        { path: "/items/...", name: "Items", component: ItemComponent }
])
export class AppComponent {

    constructor() {
        console.log('Starting App!');
    }

}