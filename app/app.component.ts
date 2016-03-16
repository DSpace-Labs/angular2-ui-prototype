import {Component, View} from 'angular2/core';
import {ROUTER_DIRECTIVES, Location, RouteConfig} from 'angular2/router';

import {HomeComponent} from './home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register.component';
import {DashboardComponent} from './dashboard.component';

import {BreadcrumbComponent} from './dspace/breadcrumb.component';
import {CommunityComponent} from './dspace/community.component';
import {CollectionComponent} from './dspace/collection.component';
import {ItemComponent} from './dspace/item.component';

import {DSpaceService} from './dspace/dspace.service';

import {HttpService} from './utils/http.service';
import {LoginService} from './login/login.service';
import {BreadcrumbService} from './dspace/breadcrumb.service';

import {LoginDirective} from './login/login.directive';

@Component({
    selector: 'dspace',
    providers: [HttpService, LoginService, BreadcrumbService]
})
@RouteConfig([
        { path: "/dashboard", name: "Dashboard", component: DashboardComponent, useAsDefault: true },
        { path: "/home", name: "Home", component: HomeComponent },
        { path: "/register", name: "Register", component: RegisterComponent },
        { path: "/login", name: "Login", component: LoginComponent },
        { path: "/communities/...", name: "Communities", component: CommunityComponent },
        { path: "/collections/...", name: "Collections", component: CollectionComponent },
        { path: "/items/...", name: "Items", component: ItemComponent }
])
@View({
    directives: [ROUTER_DIRECTIVES, LoginDirective, BreadcrumbComponent, LoginComponent],
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
                                <li><a class="hover" loginClick><span class="glyphicon glyphicon-log-in space-right"></span>Login</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <login></login>
                <breadcrumb></breadcrumb>
                <router-outlet></router-outlet>
             `
})
export class AppComponent {

    private asyncPaths = ['/communities', '/collections', '/items'];

    constructor(private location: Location,
                private dspaceService: DSpaceService,
                private breadcrumbService: BreadcrumbService) {
        console.log('Starting App!');
        this.checkAsyncPath(location.path()).then(() => {
            
            console.log('Initialize directory!');
            this.dspaceService.initDirectory();

        });
    }

    checkAsyncPath(path) {
        let ac = this;
        return new Promise(function(resolve, reject) {
            console.log(path);
            let hasAsync = false;   
            ac.asyncPaths.forEach(asyncPath => {                          
                if (path.indexOf(asyncPath) >= 0) {
                    hasAsync = true;
                    ac.breadcrumbService.loadAsyncPath(path).then(() => {
                        resolve();
                    })
                }                
            });
            if(!hasAsync) {
                resolve();
            }
        })
    }
}