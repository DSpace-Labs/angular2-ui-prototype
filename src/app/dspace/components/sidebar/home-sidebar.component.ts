import {Component, Input, OnInit} from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from 'angular2/router';
// home-specific component
@Component({
    selector: "home-sidebar",
    directives: [ROUTER_DIRECTIVES],
    template:
        `
              <div class="list-group">
                <a class="list-group-item" href="#">Create community</a>
            </div>
        `
})

export class HomeSidebarComponent
{

    constructor()
    {
        console.log("in the sidebar constructor");
    }
}