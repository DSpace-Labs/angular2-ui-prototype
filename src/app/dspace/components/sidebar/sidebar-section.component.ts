import {Component, Input, OnInit} from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from 'angular2/router';


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
            <a *ngFor="let route of sidebarcomponent.keys()" class="list-group-item" [routerLink]="['Home']"> {{ route }} </a>
        `
})

export class SidebarSectionComponent
{

    sidebarcomponent;

    constructor()
    {
    }

    ngOnInit()
    {
        // let's see which component was passed.
        console.log("in the on init of sidebar-section");
        console.log(this.sidebarcomponent);

        for(var x in this.sidebarcomponent.routes)
        {
            console.log(x);
        }

    }
}