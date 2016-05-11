import {Component, Input, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';


/**
 * Main component to render the sidebar. Will access the sidebarservice to find out how much components need to be rendered.
 * Using the sidebarservice
 */
@Component({
    selector: "sidebar-section",
    inputs: ["sidebarcomponent"],
    directives: [ROUTER_DIRECTIVES],
    template:
        `
            <h4> {{sidebarcomponent.componentName}} </h4>
            <a *ngFor="let route of sidebarcomponent.keys()" class="list-group-item" [routerLink]="[sidebarcomponent.routes[route]]"> {{ route }} </a>
        `
})

export class SidebarSectionComponent
{

    sidebarcomponent;

}