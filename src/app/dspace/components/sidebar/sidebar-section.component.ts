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
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">{{sidebarcomponent.componentName}}</h3>
                </div>
                <div class="panel-body">
                    <ul class="panel-body">
                        <li *ngFor="let route of sidebarcomponent.keys()" class="panel">
                              <a [routerLink]="[sidebarcomponent.routes[route]]"> {{ route }} </a>
                        </li>
                    </ul>
                </div>
            </div>
        `
})

export class SidebarSectionComponent
{

    sidebarcomponent;

}