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
                <tbody>
                    <tr>
                        <td>
                            <div class="row"> <!-- name of label-->
                                <div class="col-md-11 col-xs-10">
                                    <label>Section name</label>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-11 col-xs-10">
                                    <fieldset class="form-group">
                                        <input class="form-control" required [(ngModel)]="sectionName"  type="text"/>
                                    </fieldset>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- and now for the metadata things -->
                    <tr *ngFor="let entry of entries let i = index">
                        <td>
                            <fieldset>
                                <label>Url <input class="form-control" [(ngModel)]="entry.sectionUrl" required type="text"/></label>
                                <label>Name <input class="form-control" [(ngModel)]="entry.sectionUrlName" required type="text"/></label>
                                <label>Index<input class="form-control" [(ngModel)]="entry.sectionIndex" type="text"/></label>
                                <!-- only show the addition on the first? -->
                                <span *ngIf="i==0" class="glyphicon glyphicon-plus clickable" aria-hidden="true" (click)="addSectionField()"></span>
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

    sectionName : string;
    entries : Array<SidebarEntry>;


    constructor(private sidebarService : SidebarService)
    {
        this.entries = new Array<SidebarEntry>();
        this.addSectionField(); // create the first section
    }

    addSectionField()
    {
        this.entries.push(new SidebarEntry());
        this.entries = this.entries.slice(0);
    }

    removeSectionField(index)
    {
        this.entries.splice(index,1);
    }

    addSection()
    {

        let sections = new Array<SidebarSection>;
        this.entries.forEach(entry =>
        {
            let section = SidebarSection.getBuilder()
                        .name(entry.sectionName)
                        .url(entry.sectionUrl)
                        .index(entry.sectionIndex) // does not need to be set
                        .build();

            sections.push(section);
        });


        // at the end, add all these to the maincomponent


        let mainComponent = SidebarSection.getBuilder()
            .name(this.sectionName)
            .addChildren(sections)
            .id(this.sectionName)
            .build();

        this.sidebarService.addSection(mainComponent);

        /*
        let sidebarComponent = SidebarSection.getBuilder()
                                .url(this.sectionUrl).index(this.sectionIndex).name(this.sectionUrlName)
                                .id(this.sectionName+"-"+this.sectionUrl).build(); // generate a section id oursevles?




        // if the main component Id already exists, look up the component, and add to the existing component.

        */
    }
}

class SidebarEntry
{

    sectionName : string;
    sectionUrl : string;
    sectionIndex : number; // with a fancy UI, we could have the user just click somewhere in the sidebar.


}