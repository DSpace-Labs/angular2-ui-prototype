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
                <div *ngFor="let entry of entries let j=index" class="sidebar-edit-section"> <!-- one tbody for each resource? -->

                        <div class="form-group"> <!-- this needs to be on the top -->
                            <label class="sr-only" >Section name</label> <!-- here we want to show a plus somewhere? -->
                            <input  class="form-control" placeholder="section name" required [(ngModel)]="entry.componentName"  type="text"/>
                            <label>
                                <input type="checkbox"> Public?<!-- only show this to logged in users -->
                            </label>
                            <span  class="glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeSection(j)"></span>
                        </div>
                        
                    <form class="form-inline">
                        <!-- we loop over the children but we will, for now, just do it with one level -->
                        <div *ngFor="let child of entry.childsections let i = index" class="form-group">
                            <label>Name <input class="form-control" [(ngModel)]="child.componentName" required type="text"/></label>
                            <label>Url <input class="form-control" [(ngModel)]="child.url" required type="text"/></label>
                            <!--<label>Index<input class="form-control" [(ngModel)]="entry.sectionIndex" type="text"/></label>-->
                            <!-- only show the addition on the first? -->
                            <span *ngIf="i==0" class="glyphicon glyphicon-plus clickable" aria-hidden="true" (click)="addChildSectionField(entry)"></span>
                            <span *ngIf="i>0" class="glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeSectionField(i)"></span>
                        </div>
                  </form>
                </div>
            <!-- buttons here -->
            <div id="controls">
                 <button type="button" class="btn btn-primary btn-sm" (click)="addSectionField()">Add section</button>
            </div>

        `
})

/**
 * Component for the admin sidebar.
 * Here we can alter the existing sidebar.
 */
export class AdminSidebarComponent
{

    /**
     *
     */
    entries : Array<SidebarSection>;


    constructor(private sidebarService : SidebarService)
    {
        this.entries = new Array<SidebarSection>();

        this.sidebarService.sidebarSubject.subscribe(x => this.populateForm());

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

    addSectionField()
    {
        // generate a random ID based on the current time in ms.
        // assign this ID to the SidebarSections with a prefix, so we can easily distinguish which sections were added by users.
        let generatedId : string = "custom-section-" + new Date().getTime();
        this.sidebarService.addSection(SidebarSection.getBuilder().id(generatedId).addChild(new SidebarSection()).build()); // set some name by default, the user will need to provide a name though
        this.entries = this.sidebarService.getTopSections().slice(0);
    }


    addChildSectionField(parent : SidebarSection)
    {
        parent.childsections.push(new SidebarSection());
    }

    // this actually removed the section
    removeChildSection(parent, index)
    {
        // remove the child from the parent.
        this.entries.splice(index,1);
    }

    removeSection(index)
    {
        // remove the section at this index.
        console.log("removing: " + index);
        // first we find the section, then we call the sidebarservice to remove it.
        let section : SidebarSection = this.entries[index];
        console.log(section);
        // now we remove the section.
        this.sidebarService.removeSection(section);
        // update the UI of this as well.
    }

    ngOnDestroy()
    {
        console.log("saving the edits to the json file");
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

