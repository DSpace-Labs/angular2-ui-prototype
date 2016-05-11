import { Injectable, Inject} from '@angular/core';
import { SidebarSection} from '../../dspace/models/sidebar-section.model.ts';
import { ObjectUtil } from "../../utilities/commons/object.util";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/**
 * A class for the sidebar service, to remove and add components to the sidebar.
 */

@Injectable()
export class SidebarService
{

    // We need to store objects of type 'sidebar-division'
    // These objects need a name, id, ..
    // The name can be their identifier
    // We need one generic component which knows how to render these models
    // We loop in the sidebar component over all components in the array contained in this class
    // we pass the data of these array entries to the generic component, in order to be rendered.

    // we need to make sure that the router links exist.

    /**
     * breaking away from the style guide here because we want some logic in the getter.
     * @type {Array}
     * @private
     */
    private _components : SidebarSection[] = [];


    sidebarSubject : Subject<any>;

    constructor()
    {
        this.sidebarSubject = new Subject<any>();
        this.populateDefault();
    }

    /**
     * Created some default components
     * Some of these values are used as a test.
     *
     */
    private populateDefault() : void
    {
        console.log("creating some default components");

        // help component
        // each component needs a component name, so we can pass this.
        let helpComponent = new SidebarSection();
        helpComponent.componentName = "Help";
        helpComponent.addRoute("About","Home");
        helpComponent.addRoute("Imprint","Home");
        helpComponent.addRoute("Feedback","Home");
        //helpComponent.visible = false;
        helpComponent.index = 20;
        helpComponent.id = 3;
        this.addSection(helpComponent);


        // account component
        // needs to be overriden when the user is logged in.

        let accountComponent = new SidebarSection();
        accountComponent.componentName = "Account";
        accountComponent.addRoute("Login","Login");
        accountComponent.addRoute("Register","Register");
        accountComponent.index = 1100;
        accountComponent.id = 3;
        this.addSection(accountComponent);

        // find a way to make this work correctly.
        // when an item is switched to visible, the UI should update straight away.
        /*setTimeout( () =>
        {
            console.log("in the timeout");
            helpComponent.visible=true;
        },10000);
        */
    }


    /**
     * Returns an ordered array of the visible components.
     * @returns {SidebarSection[]}
     */
    get components() // TODO: rename to getFilteredComponents or something, to follow style guidelines
    {
        // first make sure that the ones without an index, appear last.
        let max = Math.max.apply(Math,this._components.filter(x => ObjectUtil.hasValue(x.index)).map(x => x.index))+1;
        this._components.forEach(component=>
        {
            if(ObjectUtil.hasNoValue(component.index))
            {
                component.index = max;
            }
        });
        var sortedVisibleComponents = this._components.filter(component => component.visible).sort(function(c1,c2) { return c1.index - c2.index;});
        return sortedVisibleComponents;
    }

    set components(components){this.components = components}

    /**
     *
     * create new component or replace existing component based on the component's id.
     * this also has the advantage of setting a new array as the _components array
     * which we want for angular's change detection
     * @param component
     */
    addSection(component : SidebarSection)
    {
        console.log("adding section");
        let newComponentArray = this.components.filter(x => x.id != component.id);
        newComponentArray.push(component);
        this._components = newComponentArray;
        // generate subject event
        this.sidebarSubject.next(true);
    }

    /**
     * Typescript supports overloading of methods, when the amount of parameters is different
     * (Because the transpiled javascript does not have types, using the same number of arguments will cause problems)
     * @param id
     * @param componentname
     * @param routes array of display name - route name
     * @param visible
     * @param index
     */
    buildSection(id, componentname, routes, visible?, index?)
    {
        let section = new SidebarSection();
        section.id = id;
        section.componentName = componentname;
        section.visible = visible;
        section.index = index;
        section.addRoutes(routes);
        console.log("added routes");
        this.addSection(section);
    }


    // remove a component based on an ID
    removeComponent(id)
    {
        this._components = this._components.filter(component => component.id != id);
        this.sidebarSubject.next(true); // create an observable event.
    }

}