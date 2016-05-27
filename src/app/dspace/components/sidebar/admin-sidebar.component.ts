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
                <div *ngFor="let entry of entries let j=index" class="panel panel-default"> <!-- one tbody for each resource? -->
                        <div class="panel-heading"> <!-- this needs to be on the top -->
                            <label>Section name <input  class="form-control" placeholder="section name" required [(ngModel)]="entry.componentName"  type="text"/> </label> <!-- here we want to show a plus somewhere? -->
                            <!-- to be implemented later 
                            <label>
                                <input type="checkbox"> Public?
                            </label>
                            -->    
                            <span  class="pull-right glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeSection(j)"></span>
                        </div>
                        
                        <!-- we loop over the children but we will, for now, just do it with one level -->
                        <div *ngFor="let child of entry.childsections let i = index" class="panel-body">
                            <label>Name <input class="form-control" [(ngModel)]="child.componentName" required type="text"/></label>
                            <label>Url <input class="form-control" [(ngModel)]="child.url" required type="text"/></label>
                            <label>Id <input class="form-control" [(ngModel)]="child.id"/></label>
                            <!-- to be implemented later
                            <label>
                                <input type="checkbox"> Public?
                            </label>
                            -->
                           
                            <!-- we only show the 'plus symbol' on the first entry -->
                            <span *ngIf="i==0" class="glyphicon glyphicon-plus clickable" aria-hidden="true" (click)="addChildSectionField(entry)"></span>
                            <span *ngIf="i>0" class="glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeChildSection(entry,i)"></span>
                        </div>
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
        let parentSection = SidebarSection.getBuilder().id(generatedId).build();
        this.addChildSectionField(parentSection);
        this.sidebarService.addSection(parentSection);
        // give this parent a child as well.
        this.entries = this.sidebarService.getTopSections().slice(0);
    }


    addChildSectionField(parent : SidebarSection)
    {
        // need to assign a random ID to the child section. Maybe also store this in the input as a hidden field?
        let generateId : string = "custom-child-section-" + new Date().getTime();
        parent.childsections.push(SidebarSection.getBuilder().id(generateId).build());
    }

    // this actually removed the section
    removeChildSection(parent, child)
    {
        parent.childsections.splice(child,1);
    }


    removeSection(index)
    {
        let section : SidebarSection = this.entries[index];
        this.sidebarService.removeSection(section);
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

