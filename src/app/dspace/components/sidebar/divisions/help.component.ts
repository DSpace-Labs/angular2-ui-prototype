import {Component, Input, OnInit} from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from 'angular2/router';

@Component({
    selector: "sidebar-help",
    directives: [ROUTER_DIRECTIVES],
    template:
        `
            <h4>Help</h4>

            <!-- all components have a title, so I can make something like view-component -->

            <div class="list-group">
                <!-- actually this needs to become a bunch of browser links -->
                <a class="list-group-item" href="#">About</a>
                <a class="list-group-item" href="#">Imprint</a>
                <a class="list-group-item" href="#">Feedback</a>
            </div>

        `
})

export class HelpComponent
{

    constructor()
    {
        console.log("in the sidebar constructor");
    }
}