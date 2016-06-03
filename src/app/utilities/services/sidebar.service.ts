import { Injectable } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { ContextProviderService } from '../../dspace/services/context-provider.service';

import { LoginModalComponent } from '../../dspace/authorization/login/login-modal.component';

import { SidebarSection } from '../../dspace/models/sidebar/sidebar-section.model.ts';
import { ObjectUtil } from "../../utilities/commons/object.util";
import { ArrayUtil } from "../../utilities/commons/array.util";
import { ViewportService } from "./viewport.service";
import { HttpService } from "./http.service";
import { URLHelper } from "../../utilities/url.helper";

/**
 * A class for the sidebar service, to remove and add components to the sidebar.
 */
@Injectable()
export class SidebarService {

    /**
     * breaking away from the style guide here because we want some logic in the getter.
     * @type {Array}
     * @private
     */
    private _components: Array<SidebarSection> = new Array<SidebarSection>();

    /**
     * A subject which we can observe for changes that happen to the sidebar.
     */
    sidebarSubject: Subject<any>;

    /**
     * A BehaviorSubject to observe the visibility of the sidebar.
     */
    isSidebarVisible: BehaviorSubject<boolean>;

    private _login: LoginModalComponent;

    /**
     * @param viewportService
     *      A singleton service that classifies the viewport's width
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(private viewportService: ViewportService,
                private router: Router, 
                private httpService: HttpService,
                private contextProvider: ContextProviderService) {
        this.sidebarSubject = new Subject<any>();
        this.isSidebarVisible = new BehaviorSubject<boolean>(true);

        //if we have info about the viewport
        //use it to determine the initial state of the sidebar
        if (this.viewportService.isSupported) {
            let isMd = this.viewportService.isMd.getValue();
            let isLg = this.viewportService.isLg.getValue();
            this.setSidebarVisibility(isLg || isMd);
        }

        this.router.subscribe(() => {
            // if the route changes on an XS screen (where the sidebar is fullscreen),
            // and the sidebar is open, close it.
            if (this.viewportService.isXs.getValue() &&
                this.isSidebarVisible.getValue()) {
                this.setSidebarVisibility(false);
            }
        });

    }

    /**
     * Returns an ordered array of the visible components.
     * @returns {SidebarSection[]}
     */
    get components() {
       return this.filterAndOrderSections(this._components);
    }

    /**
     * This method orders the sections based on their index
     * The child-section of a component are also ordered.
     * If no index is provided, the element will be added to the bottom of the sidebar.
     *
     * This function is called recursively (so children at any depth are ordered as well)
     *
     * @param sections Array<SidebarSection>
     *      It is an array of sidebar-sections which we want to order
     */
    filterAndOrderSections(sections : Array<SidebarSection>) {
        //sections = sections.filter(section => section.visible); // filter for the visible sections
        sections.forEach(section => {
           if(ObjectUtil.isEmpty(section.index)) {
               section.index = section.index + 1.0001;
           }
           if(ArrayUtil.isNotEmpty(section.childsections)) {
                section.childsections = this.filterAndOrderSections(section.childsections);
           }
        });
        return sections.sort(function(c1, c2) { return c1.index-c2.index; });
    }

    /**
     *
     * @param components
     */
    set components(components) {
        this.components = components;
    }

    get login(): LoginModalComponent {
        return this._login;
    }

    set login(login: LoginModalComponent) {
        this._login = login;
    }

    /**
     * create new component or replace existing component based on the component's id.
     * this also has the advantage of setting a new array as the _components array
     * which we want for angular's change detection
     * @param component
     */
    addSection(component: SidebarSection) {
        let newComponentArray = this.components.filter(x => x.id != component.id);
        newComponentArray.push(component);
        this._components = newComponentArray;
        // generate event for our observers.
        this.sidebarSubject.next(true);
    }

    /**
     * Remove the matching sidebar section.
     * @param section
     */
    removeSection(section: SidebarSection) {
        let c = this.removeFromSections(this._components, section);
        this._components = c;
        this.sidebarSubject.next(true);
    }

    /**
     * Will recursively look through all sections, remove the one that matches the section passed as the 'remove' parameter.
     *
     * @param sections
     *      An array of sections at the current depth through which we will look.
     * @param remove
     *      The section that is to be removed.
     * @returns {Array<SidebarSection>}
     *      An array of SidebarSections that did not get removed
     */
    private removeFromSections(sections: Array<SidebarSection>, remove: SidebarSection): Array<SidebarSection> {
        let filtered: Array<SidebarSection> = null;
        sections.forEach(section => {
            if(section.childsections != null) {
                section.childsections = this.removeFromSections(section.childsections, remove);
            }
            filtered = sections.filter(x => !x.equals(remove)); // TODO: use .equals again after casting the custom components.
        });
        if(filtered != null) {
            sections = filtered;
        }
        return sections;
    }

    /**
     * Changes the visibility of the component with the provided ID.
     * The sidebar will update by noticing the generated update event, and show/hide the element in the sidebar
     *
     * @param id
     * @param visible
     */
    changeVisibility(id: string, visible: boolean) {
        // look through all of the components / child components to find out if the visibility needs to change.
        let component = this.getComponentByID(this._components, id);
        component.visible = visible;
        this.sidebarSubject.next(true); // generate update event.
    }

    /**
     * Returns component matching an ID
     * Handy for functions that need to change something about a component
     */
    getComponentByID(sections : Array<SidebarSection>, id : string) {
        let section = sections.filter(s => s.id == id);
        if(ArrayUtil.isNotEmpty(section)) {
            return section[0];
        }
        let foundSection = null;
        sections.forEach(s => {
             foundSection =  this.getComponentByID(s.childsections,id);
        });
        if(foundSection!=null){
            return foundSection;
        }
    }

    /**
     * Returns the top-level sections.
     * (Sections that are not a child)
     */
    getCustomSections() {
        return this.components.filter(x => x.id.indexOf("custom") > -1);
    }

    /**
     * 
     * @param parent
     * @param child
     */
    addChildSection(parent, child) {
        this._components.filter(section => section.id == parent.id).forEach(section => section.childsections.push(child));
        this.sidebarSubject.next(true);
    }

    /**
     * Toggle the visibility of the sidebar
     */
    toggleSidebarVisibility(): void {
        this.isSidebarVisible.next(!this.isSidebarVisible.getValue());
    }

    /**
     * Set the visibility of the sidebar
     * @param newVisibility
     *      A boolean representing the new visibility of the sidebar
     */
    setSidebarVisibility(newVisibility: boolean) {
        this.isSidebarVisible.next(newVisibility);
    }

    /**
     * Reads the data in the sidebar file from the server.
     * Then it adds these sidebarsections (defined in json) to our SidebarService.
     * @returns {Promise<TResult>|Promise<U>}
     */
    readSidebarFromFile(): void {
        // first delete the old custom components
        // we can just find the headers and delete those for now
        let removeComponents = this.getCustomSections();

        let newComponents = Array<SidebarSection>();

        this._components.forEach(section => {
            if(section.id.indexOf("custom") <= -1) {
                newComponents.push(section);
            }
        });

        console.log(newComponents);

        this._components = newComponents.slice(0);

        console.log(this._components);

        // write the custom sidebar sections to a file.
        // convert the sidebar to json.
        this.httpService.get({
            url: URLHelper.relativeToAbsoluteUIURL('/custom-sidebar')            
        }).forEach(res => {
            // create a sidebarsection out of the result.
            // so we can use the normal comparison (full object) instead of only the ID in our filter methods.
            // Plus, we won't have random objects around the SidebarService which might give problems later on.
            for(let section of res){
                let buildSection = new SidebarSection(section);
                this.addSection(buildSection);
            }
        });
    }

    // Methods to access injected context provider from sidebar service

    isRootContext(): boolean {
        return this.contextProvider.context ? this.contextProvider.context.root : true;
    }

    // methods used by actions of sidebar

    // uses bracket notation to invoke
    // i.e. action = Edit and runs method sidebarService["action" + "Edit"]

    actionEdit(): void {
        this.contextProvider.enableEditMode();
    }

    actionLogin(): void {
        this.login.openLoginModal();
    }

}

