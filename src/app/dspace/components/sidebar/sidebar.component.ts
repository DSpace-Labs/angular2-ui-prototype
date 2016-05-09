import {Component, Input, OnInit} from 'angular2/core';


@Component({
    selector: "sidebar",
    template:
        `
            <h1>testing the sidebar </h1>
        `
})

export class SidebarComponent
{

    constructor()
    {
        console.log("in the sidebar constructor");
    }
}