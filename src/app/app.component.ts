import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {HomeComponent} from './home.component';
import {LoginComponent} from './login.component';
import {RegisterComponent} from './register.component';
import {DashboardComponent} from './dashboard.component';
import {SettingsComponent} from './settings.component';
import {SetupComponent} from './setup.component';

import {CommunityComponent} from './dspace/community.component';
import {CollectionComponent} from './dspace/collection.component';
import {ItemComponent} from './dspace/item.component';

@Component({
    selector: 'dspace',
    directives: [ROUTER_DIRECTIVES],
    template: `
                <div>
                    <ul>
                        <li><a [routerLink]="['/Home']">Home</a></li>
                        <li><a [routerLink]="['/Dashboard']">Dashboard</a></li>
                        <li><a [routerLink]="['/Settings']">Settings</a></li>
                        <li><a [routerLink]="['/Setup']">Setup</a></li>
                        <li><a [routerLink]="['/Register']">Register</a></li>
                        <li><a [routerLink]="['/Login']">Login</a></li>
                    </ul>
                </div>
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
        console.log();
        console.log('Starting App!');
    }

}