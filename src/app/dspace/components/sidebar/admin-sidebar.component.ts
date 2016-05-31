import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { SidebarService } from '../../../utilities/services/sidebar.service.ts';
import { SidebarSection } from '../../models/sidebar/sidebar-section.model';
import { SidebarSectionComponent } from './sidebar-section.component';
import { ArrayUtil } from "../../../utilities/commons/array.util";

import {  TranslatePipe } from "ng2-translate/ng2-translate";

/**
 * Main component to render the sidebar. Will access the sidebarservice to find out which components need to be rendered.
 */
@Component({
    selector: "admin-sidebar",
    directives: [ROUTER_DIRECTIVES, SidebarSectionComponent],
    pipes: [ TranslatePipe ],
    template:
        `
                <h1>{{'sidebar.admin.edit.header' | translate}}</h1>
                <div *ngFor="let entry of entries let j=index" class="panel panel-default"> <!-- one tbody for each resource? -->
                        <div class="panel-heading"> <!-- this needs to be on the top -->
                            <label>{{ 'sidebar.admin.edit.section-name' | translate }}<input  class="form-control" placeholder="section name" required [(ngModel)]="entry.componentName"  type="text"/> </label> <!-- here we want to show a plus somewhere? -->
                            <!-- to be implemented later 
                            <label>
                                <input type="checkbox"> Public?
                            </label>
                            -->    
                            <span  class="pull-right glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeSection(j)"></span>
                        </div>
                        
                        <!-- we loop over the children but we will, for now, just do it with one level -->
                        <div *ngFor="let child of entry.childsections let i = index" class="panel-body">
                            <label>{{'sidebar.admin.edit.child-section-name' | translate}} <input class="form-control" [(ngModel)]="child.componentName" required type="text"/></label>
                            <label>{{'sidebar.admin.edit.child-section-url' | translate}} <input class="form-control" [(ngModel)]="child.url" required type="text"/></label>
                            <input type="hidden" class="form-control" [(ngModel)]="child.id"/>
                            <!-- to be implemented later
                            <label>
                                <input type="checkbox"> Public?
                            </label>
                            -->
                           
                            <!-- we only show the 'plus symbol' on the first entry -->
                            <span *ngIf="i==0" class="glyphicon glyphicon-plus clickable" aria-hidden="true" (click)="addChildSectionField(entry)"></span>
                            <span class="glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeChildSection(entry,i)"></span>
                        </div>
                        
                        <!-- if there are no children o the current component, we still want to show an add button to add the first child -->
                        <button *ngIf="!hasChildren(entry)" type="button" class="btn btn-primary btn-sm" (click)="addChildSectionField(entry)">{{'sidebar.admin.edit.add-child' | translate}}</button>        
                        
                </div>
            <!-- buttons here -->
            <div id="controls">
                 <button type="button" class="btn btn-primary btn-sm" (click)="addSectionField()">{{'sidebar.admin.edit.add-section' | translate}}</button>
                 <button type="button" class="btn btn-primary btn-sm" (click)="writeSidebarToFile()">{{'sidebar.admin.edit.save' | translate}}</button> 
            </div>

        `
})

/**
 * A class for an admin to extend the sidebar
 * Components can be added. At the moment they can only be headers or static links.
 */
export class AdminSidebarComponent
{

    /**
     *
     */
    entries : Array<SidebarSection>;

    /**
     * Will store our subscription to the sidebarService.sidebarSubject
     * Watches for changes that happen on our sidebarSubject.
     */
    subscription : any;

    /**
     *
     * @param sidebarService
     *      SidebarService is a singleton service to deal with communication with the sidebar.
     * @param http
     *      Http is used to write to our node.js server.
     */
    constructor(private sidebarService : SidebarService, private http : Http) {

    }


    /**
     *
     */
    ngOnInit()
    {
        // onsubscribe error mh.
        this.entries = new Array<SidebarSection>();
        this.subscription = this.sidebarService.sidebarSubject.subscribe(x => {this.populateForm();}); // this only runs the first time?
        this.populateForm();
    }

    /**
     * Initially populate our fomr
     */
    populateForm()
    {
        let customSections = this.sidebarService.getCustomSections();
        this.entries = customSections.slice(0);
    }

    /**
     * Add a top-level section
     */
    addSectionField()
    {
        // generate a random ID based on the current time in ms.
        // assign this ID to the SidebarSections with a prefix, so we can easily distinguish which sections were added by users.
        let parentSection = SidebarSection.getBuilder().generateUserID(true).build();
        this.addChildSectionField(parentSection);
        this.sidebarService.addSection(parentSection);
        this.entries = this.sidebarService.getCustomSections().slice(0);
    }


    /**
     * Add a child sectoin to the parent.
     * @param parent
     */
    addChildSectionField(parent : SidebarSection)
    {
        let childSection = SidebarSection.getBuilder().generateUserID(true).build(); // let our builder generate an ID.
        this.sidebarService.addChildSection(parent,childSection);
        this.entries = this.sidebarService.getCustomSections().slice(0); // update the entries on this page. slice to change reference.
    }


    /**
     * Remove a child section from the parent.
     * @param parent
     * @param child
     */
    removeChildSection(parent, child)
    {
        // this should probably be done through the sidebarService.
        // But doing it this way made the change detection trigger correctly.
        // TODO: working change detection throught the sidebarService.
        parent.childsections.splice(child,1);
    }


    /**
     * Save the configuration of the current sidebar as a JSON string inside a file on the server.
     * This is done by creating a POST request to our node.js server.
     * @returns {Promise<T>}
     */
    writeSidebarToFile()
    {
        return new Promise((resolve,reject) =>
        {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(xhr.response);
                    }else{
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST","http://localhost:3000/customsidebar",true); // send a post request to our node.js server.
            xhr.setRequestHeader("Content-type","application/json");
            let jsonString = JSON.stringify(this.entries);
            xhr.send(jsonString);
        });
    }


    /**
     * Destroy our subscription to sidebarService.sidebarSubject.
     */
    ngOnDestroy()
    {
        // cancel subscription
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    /**
     * Remove a section based on the index in the curently rendered form.
     * @param index
     */
    removeSection(index)
    {
        let section : SidebarSection = this.entries[index];
        this.sidebarService.removeSection(section);
    }


    /**
     * Returns true if the current element has children
     * @param parent
     * @returns {boolean}
     */
    hasChildren(parent) : boolean
    {
        return ArrayUtil.isNotEmpty(parent.childsections);
    }
}

