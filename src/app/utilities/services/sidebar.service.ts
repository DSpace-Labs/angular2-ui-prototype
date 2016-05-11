import { Injectable, Inject} from 'angular2/core';
import { SidebarSection} from '../../dspace/models/sidebar-section.model.ts';

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
        helpComponent.visible = false;
        this.components.push(helpComponent);

        // account component
        // needs to be overriden when the user is logged in.

        let accountComponent = new SidebarSection();
        accountComponent.componentName = "Account";
        accountComponent.addRoute("Login","Login");
        accountComponent.addRoute("Register","Register");
        this.components.push(accountComponent);


    }


    get components()
    {
        return this._components.filter(comp => comp.visible);
    }

    // adds a component.
    addComponent()
    {
        // this will create a component and add it.
    }

    // remove a component based on an ID
    removeComponent(id)
    {

    }
}