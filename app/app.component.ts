import {Component, View} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HomeComponent} from './home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register.component';
import {DashboardComponent} from './dashboard.component';
import {DSpaceObjectComponent} from './dspace/dspace.component';

import {HttpService} from './utils/http.service';
import {LoginService} from './login/login.service';

import {LoginDirective} from './login/login.directive';

@Component({
    selector: 'dspace',
    providers: [HttpService, LoginService]
})
@RouteConfig([
    { path: "/home",      name: "Home",      component: HomeComponent, useAsDefault: true },
    { path: "/register",  name: "Register",  component: RegisterComponent },
    { path: "/login",     name: "Login",     component: LoginComponent },
    { path: "/dashboard", name: "Dashboard", component: DashboardComponent },
    { path: "/tdl-rest/{level}/{id}",  name: "Tdl-rest",  component: DSpaceObjectComponent }
])
@View({
    directives: [ROUTER_DIRECTIVES, LoginDirective, LoginComponent],
    template: `
                <nav class="navbar navbar-inverse">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span> 
                            </button>
                            <a class="navbar-brand" [routerLink]="['/Home']">Angular DSpace UI</a>
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
                <router-outlet></router-outlet>
             `
})
export class AppComponent { }