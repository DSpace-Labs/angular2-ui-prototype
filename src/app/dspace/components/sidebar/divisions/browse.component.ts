import {Component, Input, OnInit} from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from 'angular2/router';

@Component({
    selector: "sidebar-browse",
    directives: [ROUTER_DIRECTIVES],
    template:
        `
            <h4>Browse</h4>

            <!-- all components have a title, so I can make something like view-component -->

            <div class="list-group">
                <!-- actually this needs to become a bunch of browser links -->
                <a class="list-group-item" href="#">All of DSpace</a>
                <a class="list-group-item" href="#">By issue date</a>
                <a class="list-group-item" href="#">Authors</a>
                <a class="list-group-item" href="#">Titles</a>
                <a class="list-group-item" href="#">Subjects</a>
                <a class="list-group-item" href="#">Type</a>

            </div>

        `
})

export class BrowseComponent
{

    constructor()
    {
        console.log("in the sidebar constructor");
    }
}