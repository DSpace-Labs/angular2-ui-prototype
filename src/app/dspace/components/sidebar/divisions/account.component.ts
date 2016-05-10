import {Component, Input, OnInit} from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from 'angular2/router';

@Component({
    selector: "sidebar-account",
    directives: [ROUTER_DIRECTIVES],
    template:
        `
            <h4>Account</h4>

            <!-- all components have a title, so I can make something like view-component -->

            <div class="list-group">
                <!-- actually this needs to become a bunch of browser links -->
                <!-- needs to check if the user is logged in -->
                <a class="list-group-item" href="#">Logout</a>
                <a class="list-group-item" href="#">Profile</a>
                <a class="list-group-item" href="#">Submissions</a>
            </div>

        `
})

export class AccountComponent
{

    constructor()
    {
        console.log("in the sidebar constructor");
    }
}