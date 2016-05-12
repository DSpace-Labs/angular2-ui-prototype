import {Component, Input, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';


/**
 * Component to render children of a sidebar section
 */
@Component({
    selector: "sidebar-section-children",
    inputs: ["sectionchildren"],
    directives: [ROUTER_DIRECTIVES],
    template:
        `
                <h1>child component test </h1>
        `
})

export class SidebarSectionChildrenComponent
{

    sectionchildren : any;

    constructor()
    {

    }

    ngOnInit()
    {
        console.log("refactor this to use @input");
        console.log(this.sectionchildren);
    }

    ngOnChanges()
    {

        console.log("in on changes");
        console.log(this.sectionchildren);
    }
}