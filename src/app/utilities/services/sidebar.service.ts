import { Injectable, Inject } from '@angular/core';
import { SidebarSection } from '../../dspace/models/sidebar/sidebar-section.model.ts';
import { ObjectUtil } from "../../utilities/commons/object.util";
import { ArrayUtil } from "../../utilities/commons/array.util";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/**
 * A class for the sidebar service, to remove and add components to the sidebar.
 */
@Injectable()
export class SidebarService
{

    /**
     * breaking away from the style guide here because we want some logic in the getter.
     * @type {Array}
     * @private
     */
    private _components : SidebarSection[] = [];

    /**
     * A subject which we can observe for changes that happen to the sidebar.
     */
    sidebarSubject : Subject<any>;


    /**
     *
     */
    constructor()
    {
        this.sidebarSubject = new Subject<any>();
    }


    /**
     * Returns an ordered array of the visible components.
     * @returns {SidebarSection[]}
     */
    get components()
    {
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
    filterAndOrderSections(sections : Array<SidebarSection>)
    {
        //sections = sections.filter(section => section.visible); // filter for the visible sections
        sections.forEach(section =>
        {
           if(ObjectUtil.isEmpty(section.index))
           {
               section.index = section.index + 1.0001;
           }
           if(ArrayUtil.isNotEmpty(section.childsections))
           {
                section.childsections = this.filterAndOrderSections(section.childsections);
           }
        });
        return sections.sort(function(c1,c2) { return c1.index-c2.index;});
    }


    /**
     *
     * @param components
     */
    set components(components)
    {
        this.components = components
    }

    /**
     *
     * create new component or replace existing component based on the component's id.
     * this also has the advantage of setting a new array as the _components array
     * which we want for angular's change detection
     * @param component
     */
    addSection(component : SidebarSection)
    {
        let newComponentArray = this.components.filter(x => x.id != component.id);
        newComponentArray.push(component);
        this._components = newComponentArray;
        // generate subject event
        this.sidebarSubject.next(true);
    }



    /**
     * Remove the matching sidebar section.
     * @param section
     */
    removeSection(section : SidebarSection)
    {
        let components = this._components.filter(x => !x.equals(section));
        this._components = components;
        this.sidebarSubject.next(true);
    }

    /**
     * Changes the visibility of the component with the provided ID.
     * The sidebar will update by noticing the generated update event, and show/hide the element in the sidebar
     *
     * @param id
     * @param visible
     */
    changeVisibility(id : string, visible :boolean)
    {
        // look through all of the components / child components to find out if the visibility needs to change.
        let component = this.getComponentByID(this._components,id);
        component.visible = visible;
        this.sidebarSubject.next(true); // generate update event.
    }

    /**
     * Returns component matching an ID
     * Handy for functions that need to change something about a component
     */
    getComponentByID(sections : Array<SidebarSection>, id : string)
    {
        let section = sections.filter(s => s.id == id);
        if(ArrayUtil.isNotEmpty(section)){
            return section[0];
        }
        let foundSection = null;
        sections.forEach(s =>
        {
             foundSection =  this.getComponentByID(s.childsections,id);
        });
        if(foundSection!=null){
            return foundSection;
        }
    }
}

