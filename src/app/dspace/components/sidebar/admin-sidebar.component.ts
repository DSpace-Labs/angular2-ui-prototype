import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';

import { ContextProviderService } from '../../../dspace/services/context-provider.service';
import { SidebarService } from '../../../utilities/services/sidebar.service.ts';
import { SidebarSection } from '../../models/sidebar/sidebar-section.model';
import { SidebarSectionComponent } from './sidebar-section.component';
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
            <!-- put this all in a table -->

            <table class="table table-striped">
                <tbody *ngFor="let entry of entries #j=index"> <!-- one tbody for each resource? -->
                    <tr>
                        <td>
                            <div class="row"> <!-- name of label-->
                                <div class="col-md-11 col-xs-10">
                                    <label>Section name</label>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-11 col-xs-10">
                                    <fieldset class="">
                                        <input class="form-control" required [(ngModel)]="entry.componentName"  type="text"/> <!-- here we want to show a plus somewhere? -->
                                         <span *ngIf="j==0" class="glyphicon glyphicon-plus clickable" aria-hidden="true" (click)="addSectionField()"></span> <!-- this to add a whole section -->
                                    </fieldset>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- and now for the metadata things -->
                    <!-- we loop over the children but we will, for now, just do it with one level -->
                    <tr *ngFor="let child of entry.childsections let i = index">
                        <td>
                            <fieldset>
                                <label>Name <input class="form-control" [(ngModel)]="child.componentName" required type="text"/></label>
                                <label>Url <input class="form-control" [(ngModel)]="child.url" required type="text"/></label>
                                <!--<label>Index<input class="form-control" [(ngModel)]="entry.sectionIndex" type="text"/></label>-->
                                <!-- only show the addition on the first? -->
                                <span *ngIf="i==0" class="glyphicon glyphicon-plus clickable" aria-hidden="true" (click)="addChildSectionField(entry)"></span>
                                <span *ngIf="i>0" class="glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeSectionField(i)"></span>
                            </fieldset>
                        </td>
                    </tr>
                </tbody>

            </table>

          <button type="button" class="btn btn-primary btn-sm" (click)="addSection()">Create section</button>
        `
})

/**
 * Component for the admin sidebar.
 * Here we can alter the existing sidebar.
 */
export class AdminSidebarComponent
{

    /**
     * Header of the section
     */
    sectionName : string;

    /**
     *
     */
    entries : Array<SidebarSection>;


    constructor(private sidebarService : SidebarService)
    {
        this.entries = new Array<SidebarSection>();

        let atmireLink = SidebarSection.getBuilder().name("atmire").id("custom-sidebar-section.atmire").url("http://www.atmire.com").build();
        let customSection = SidebarSection.getBuilder().name("Resources").id("custom-sidebar-section").addChild(atmireLink).build();
        this.sidebarService.addSection(customSection);

        // Let's see what happens when I already have an entry.
        // maybe store the user-specific sections as starting with 'user'

        // this.addSectionField(); // create the first section

        this.populateForm();
    }

    // populate with the sections that already exist.
    // in the future needs to be loeaded from a file.
    populateForm()
    {
        let customSections = this.sidebarService.getTopSections();
        this.entries = customSections.slice(0);

        // now we populate our system based on this.
        // one section per top-level, put the children underneath this
    }


    // add a top-level section
    addSectionField()
    {
        // generate the "custom id"
        console.log("added a field");
        this.sidebarService.addSection(SidebarSection.getBuilder().id("custom-something-else").name("nothing!").addChild(new SidebarSection()).build()); // set some name by default, the user will need to provide a name though
        this.entries = this.sidebarService.getTopSections().slice(0);
    }


    addChildSectionField(parent : SidebarSection)
    {
        console.log("adding to: " + parent.componentName);
        parent.childsections.push(new SidebarSection());
    }

    removeSectionField(index)
    {
        this.entries.splice(index,1);
    }

}

/*
class SidebarEntry
{

    // a top-level only has a name, not a url. That is one way to notice the difference.
    // but the children need to be attached to the parent somehow.
    sectionName : string;
    sectionUrl : string;
    sectionIndex : number; // with a fancy UI, we could have the user just click somewhere in the sidebar.

}
    */