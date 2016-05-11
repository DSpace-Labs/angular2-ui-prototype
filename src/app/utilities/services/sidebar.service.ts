import { Injectable, Inject} from '@angular/core';
import { SidebarSection} from '../../dspace/models/sidebar-section.model.ts';
import { ObjectUtil } from "../../utilities/commons/object.util";

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

    private _components : SidebarSection[] = [];

    constructor()
    {
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
        this.addSection(helpComponent);


        // account component
        // needs to be overriden when the user is logged in.

        let accountComponent = new SidebarSection();
        accountComponent.componentName = "Account";
        accountComponent.addRoute("Login","Login");
        accountComponent.addRoute("Register","Register");
        accountComponent.index = 1100;
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
    get components()
    {
        // first make sure that the ones without an index, appear last.
        let max = Math.max.apply(Math,this._components.filter(x => ObjectUtil.hasValue(x.index)).map(x => x.index))+1;
        this._components.forEach(component =>
        {
            if(ObjectUtil.hasNoValue(component.index))
            {
                component.index = max;
            }
        });
        var sortedVisibleComponents = this._components.filter(component => component.visible).sort(function(c1,c2) { return c1.index - c2.index;});
        return sortedVisibleComponents;
    }

    // adds a component.
    addSection(component : SidebarSection)
    {
        // check if this section already exists.

        this._components.push(component);
    }

    // remove a component based on an ID
    removeComponent(id)
    {

    }
}