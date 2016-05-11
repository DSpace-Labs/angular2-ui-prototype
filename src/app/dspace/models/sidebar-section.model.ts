

export class SidebarSection
{

    private _id : number;

    private _index : number;

    private _componentName : string;

    private _visible : boolean;

    private _children : Array<SidebarSection>; // children of this model.


    /**
     * A map of routes.
     * A route contains a name (to display), and a routing-name (name as it appears in the router).
     * Name should be an i18n string.
     * @type {{}}
     */
    private routes : { [name:string] : string } = {};



    constructor()
    {

    }

    get componentName(){return this._componentName;}
    set componentName(name : string)
    {
        this._componentName = name;
    }

    /**
     * Adds a route.
     * This route needs to be in the router links.
     * Renders with the router-link component.
     * @param name
     * @param url
     */
    addRoute(name : string, url : string)
    {
        // what to do if a dev wants to override a route? Return an error?
        this.routes[name] = url;
    }


    /**
     * Angular2 currently does not suport iterating over a map, this is one way to get it to work anyway.
     * https://github.com/angular/angular/issues/2246
     */
    keys()
    {
        return Object.keys(this.routes);
    }
}