import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';


import {TitleComponent} from './title.component';

// Require our Universal App
import {AppComponent} from '../app/app.component';

import {HomeComponent} from '../app/home.component';
import {LoginComponent} from '../app/login.component';
import {RegisterComponent} from '../app/register.component';
import {DashboardComponent} from '../app/dashboard.component';
import {SettingsComponent} from '../app/settings.component';
import {SetupComponent} from '../app/setup.component';

import {CommunityComponent} from '../app/dspace/community.component';
import {CollectionComponent} from '../app/dspace/collection.component';
import {ItemComponent} from '../app/dspace/item.component';

import {DSpaceService} from '../app/dspace/dspace.service';
import {HttpService} from '../app/utils/http.service';
import {WebSocketService} from '../app/utils/websocket.service';

@Component({
    selector: 'html',
    directives: [AppComponent, TitleComponent],
    providers: [
        DSpaceService,
        HttpService,
        WebSocketService
    ],
    template: `
               <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <base href="/">
                    <title></title>
                </head>
                <body>
                    <dspace>Loading...</dspace>
                </body>
                <script async src="dist/app.bundle.js"></script>
                <script async src="dist/material.bundle.js"></script>
                <script async src="dist/styles.bundle.js"></script>
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
export class ServerAppComponent {

    constructor() {
        console.log('Starting Server App!');
    }

}