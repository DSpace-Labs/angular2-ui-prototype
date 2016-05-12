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
            <div class="sidebar-simple-section-element">
                <span>{{sidebarcomponent.componentName}}</span>
            </div>
            <ul>
                <li *ngFor="let route of sidebarcomponent.keys()" class="sidebar-simple-section-element">
                      <a [routerLink]="[sidebarcomponent.routes[route]]"> {{ route }} </a>
                </li>
            </ul>

        `
})

export class SidebarSectionComponent
{

    sidebarcomponent;

}