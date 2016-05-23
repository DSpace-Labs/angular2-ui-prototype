import {Component, Input, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';

import { ContextProviderService } from '../../../dspace/services/context-provider.service';
import {SidebarService} from '../../../utilities/services/sidebar.service.ts';
import {SidebarSection} from '../../models/sidebar/sidebar-section.model';
import { HrefSidebarSection } from '../../models/sidebar/hrefsidebar-section.model';
import {SidebarSectionComponent} from './sidebar-section.component';
/**
 * Main component to render the sidebar. Will access the sidebarservice to find out how much components need to be rendered.
 * Using the sidebarservice
 */
@Component({
    selector: "admin-sidebar",
    directives: [ROUTER_DIRECTIVES, SidebarSectionComponent],
    template:
        `
            <h1>Edit the sidebar</h1>
            <!-- show the sidebar here, with some added options (to add links) -->

            <form id="addsidebarsection">
                <fieldset>
                    <label>Section name:<input  required [(ngModel)]="sectionName"  type="text"/></label>
                </fieldset>
                <fieldset>
                    <label>Url:<input [(ngModel)]="sectionUrl" required type="text"/></label>
                    <label>Url name: <input [(ngModel)]="sectionUrlName" required type="text"/></label>
                    <label>Index:<input [(ngModel)]="sectionIndex" type="text"/></label>
                    <button value="Add" (click)="addSection()">Add</button>
                </fieldset>
            </form>

        `
})

/**
 * Component for the admin sidebar.
 * Here we can alter the existing sidebar.
 */
export class AdminSidebarComponent
{
    // at the moment we can only add the hrefsidebar

    sectionName : string;
    sectionUrl : string;
    sectionIndex : number; // with a fancy UI, we could have the user just click somewhere in the sidebar.
    sectionUrlName: string;

    constructor(private sidebarService : SidebarService)
    {
        // we name one section
        // the section can have multiple children
    }


    addSection()
    {
        console.log("section name: " + this.sectionName);
        // create new sidebar based on the data that I got here.
        // will need to switch over the ones that are set.
        // or I can pass undefined and have the builder check these thigns?
        let sidebarComponent = HrefSidebarSection.getBuilder()
                                .url(this.sectionUrl).index(this.sectionIndex).name(this.sectionUrlName)
                                .id(this.sectionName+"-"+this.sectionUrl).build(); // generate a section id oursevles?




        // if the main component Id already exists, look up the component, and add to the existing component.
        let mainComponent = HrefSidebarSection.getBuilder()
                            .name(this.sectionName)
                            .addChild(sidebarComponent)
                            .id(this.sectionName)
                            .build();
        this.sidebarService.addSection(mainComponent);
    }
}