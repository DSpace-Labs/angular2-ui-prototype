import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { FormBuilder } from '@angular/common'
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';

import { SidebarService } from '../../../utilities/services/sidebar.service.ts';
import { SidebarSection } from '../../models/sidebar/sidebar-section.model';
import { SidebarSectionComponent } from './sidebar-section.component';
import { ArrayUtil } from "../../../utilities/commons/array.util";

import { BreadcrumbService } from '../../../navigation/services/breadcrumb.service';
import { Breadcrumb } from '../../../navigation/models/breadcrumb.model';

import { TranslatePipe } from "ng2-translate/ng2-translate";
import { FormSecureComponent } from "../../../utilities/form/form-secure.component";
import { FormService } from "../../../utilities/form/form.service";
import { AuthorizationService } from "../../authorization/services/authorization.service";

import { URLHelper } from "../../../utilities/url.helper";

/**
 * Main component to render the sidebar. Will access the sidebarservice to find out which components need to be rendered.
 */
@Component({
    selector: "adminSidebar",
    directives: [ ROUTER_DIRECTIVES, SidebarSectionComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <h1>{{'sidebar.admin.edit.header' | translate}}</h1>
                <div *ngFor="let entry of entries let j=index" class="admin-edit-sidebar panel panel-default"> 
                    <div class="panel-heading"> <!-- this needs to be on the top -->
                        <label>{{ 'sidebar.admin.edit.section-name' | translate }}<input  class="form-control" placeholder="section name" required [(ngModel)]="entry.componentName"  type="text"/> </label> 
                        <!-- to be implemented later 
                        <label>
                            <input type="checkbox"> Public?
                        </label>
                        -->    
                       <span  class="ion-icon ion-ios-close-empty clickable pull-right" aria-hidden="true" (click)="removeSection(j)"></span>
                 
                    </div>
                            
                    <!-- we loop over the children but we will, for now, just do it with one level -->
                    <div *ngFor="let child of entry.childsections let i = index" class="panel-body">
                        <div class="clearfix" >
                            <div class="pull-left">
                            
                                <label> <span>{{'sidebar.admin.edit.child-section-name' | translate}} </span> <input class="form-control" [(ngModel)]="child.componentName" required type="text"/></label>
                                <label><span>{{'sidebar.admin.edit.child-section-url' | translate}} </span><input class="form-control" [(ngModel)]="child.url" required type="text"/></label>
                                <input type="hidden" class="form-control" [(ngModel)]="child.id"/>
                            </div>
                            <!-- to be implemented later
                            <label>
                                <input type="checkbox"> Public?
                            </label>
                            -->
                            <!-- we only show the 'plus symbol' on the first entry -->
                            <div class="pull-left">
                                <span *ngIf="i==0" class="ion-icon ion-ios-plus-empty clickable sidebar-ion-placement" aria-hidden="true" (click)="addChildSectionField(entry)"></span>
                                <span  *ngIf="i>0" class="ion-icon ion-ios-close-empty clickable sidebar-ion-placement" aria-hidden="true" (click)="removeChildSection(entry,i)"></span>
                            </div>
                        </div>
                    </div>  
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
 * FormSecureComponent is inherited, so a user can only view this component when s/he is authenticated.
 */
export class AdminSidebarComponent extends FormSecureComponent implements OnInit, OnDestroy {

    /**
     *
     */
    entries: Array<SidebarSection>;

    /**
     * Will store our subscription to the sidebarService.sidebarSubject
     * Watches for changes that happen on our sidebarSubject.
     */
    subscription: any;

    /**
     *
     * @param sidebarService
     *      SidebarService is a singleton service to interact with the sidebar sections.
     * @param http
     *      HttpService is a singleton service to create xhr calls.
     * @param formService
     *      FormService is a singleton service to retrieve form data.
     * @param builder
     *      FormBuilder is a singleton service provided by Angular2.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(private sidebarService: SidebarService,
                private breadcrumbService: BreadcrumbService,
                private http: Http,
                formService: FormService,
                formBuilder: FormBuilder,
                authorization: AuthorizationService,
                router: Router) {
        super(formService, formBuilder, authorization, router);
         breadcrumbService.visit(new Breadcrumb('adminSidebar', true));
    }

    /**
     *
     */
    ngOnInit() {
        this.entries = new Array<SidebarSection>();
        // TODO: refactor variable x explicitly, variable from subscription is kind of important to know
        this.subscription = this.sidebarService.sidebarSubject.subscribe(x => {this.populateForm();});
        this.populateForm();
    }

    /**
     * Initially populate our form
     */
    populateForm() {
        let customSections = this.sidebarService.getCustomSections();
        this.entries = customSections.slice(0);
    }

    /**
     * Add a top-level section
     */
    addSectionField() {
        // generate a random ID based on the current time in ms.
        // assign this ID to the SidebarSections with a prefix, so we can easily distinguish which sections were added by users.
        let parentSection = SidebarSection.getBuilder().generateUserID(true).name("untitled").addChild(SidebarSection.getBuilder().name("untitled").generateUserID(true).url("http://www.google.com").build()).build();
        //this.addChildSectionField(parentSection);
        this.sidebarService.addSection(parentSection);
        this.entries = this.sidebarService.getCustomSections().slice(0);
    }


    /**
     * Add a child sectoin to the parent.
     * @param parent
     */
    addChildSectionField(parent: SidebarSection) {
        // TODO: remove hardcoded google url
        let childSection = SidebarSection.getBuilder().generateUserID(true).url("http://www.google.com").name("untitled").build(); // let our builder generate an ID.
        this.sidebarService.addChildSection(parent,childSection);
        this.entries = this.sidebarService.getCustomSections().slice(0); // update the entries on this page. slice to change reference.
    }


    /**
     * Remove a child section from the parent.
     * @param parent
     * @param child
     */
    removeChildSection(parent, child) {
        // this should probably be done through the sidebarService.
        // But doing it this way made the change detection trigger correctly.
        // TODO: working change detection through the sidebarService.
        parent.childsections.splice(child,1);
    }


    /**
     * Save the configuration of the current sidebar as a JSON string inside a file on the server.
     * This is done by creating a POST request to our node.js server.
     * @returns {Promise<T>}
     */
    writeSidebarToFile() {

        console.log("writing sidebar to file");
        return new Promise((resolve,reject) => {
            
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                
                if(xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        resolve(xhr.response);
                    }else{
                        reject(xhr.response);
                    }
                }
                
            }
            
            
            // send a post request to our node.js server.
            xhr.open("POST", URLHelper.relativeToAbsoluteUIURL('/custom-sidebar'), true);
            
            xhr.setRequestHeader("Content-type", "application/json");

            let jsonString = JSON.stringify(this.entries);

            xhr.send(jsonString);
        });
    }


    /**
     * Destroy our subscription to sidebarService.sidebarSubject.
     */
    ngOnDestroy() {
        // cancel subscription
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
        // reload the sidebar from the server.
        // timeout as workaround for navigation
        setTimeout(() => this.sidebarService.readSidebarFromFile(), 20);
    }

    /**
     * Remove a section based on the index in the curently rendered form.
     * @param index
     */
    removeSection(index) {
        let section: SidebarSection = this.entries[index];
        this.sidebarService.removeSection(section);
    }


    /**
     * Returns true if the current element has children
     * @param parent
     * @returns {boolean}
     */
    hasChildren(parent): boolean {
        return ArrayUtil.isNotEmpty(parent.childsections);
    }
}

