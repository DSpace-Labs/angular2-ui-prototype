import {Component, Input, OnInit} from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from 'angular2/router';
import { HelpComponent } from './divisions/help.component';
import { BrowseComponent } from './divisions/browse.component';
import { AccountComponent} from './divisions/account.component';


/*
    Collection specific elements for the sidebar
 */
@Component({
    selector: "collection-sidebar",
    directives: [ROUTER_DIRECTIVES, HelpComponent, BrowseComponent, AccountComponent],
    template:
        `
            <div class="list-group">
                <!-- actually this needs to become a bunch of browser links -->
                <!-- needs to check if the user is logged in -->
                <a class="list-group-item" href="#">Edit Collection</a>
                <a class="list-group-item" href="#">Export Collection</a>
            </div>

        `
})

export class CollectionSidebarComponent
{

    constructor()
    {
        console.log("in the sidebar constructor");
    }
}