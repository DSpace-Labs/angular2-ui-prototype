
// TODO: fix the used style guide.
export class SidebarSection
{

    /**
     * This number can be used to overwrite a component.
     */
    private _id : number;

    /**
     * The order for which an item appears in the sidebar.
     * When a collision, we will see what the sort returns.
     */
    private _index : number;

    private _componentName : string;

    private _visible : boolean = true;

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

    get componentName() : string {return this._componentName;}
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
     * Adds an object containing routes
     * Overwrites manually added routes at this point
     * @param routes
     */
    addRoutes(routes)
    {
        console.log(routes);
        this.routes = routes;
        console.log(this.routes);
    }


    get visible() : boolean { return this._visible; }
    set visible(isvisible : boolean) {this._visible = isvisible; }

    get index() : number { return this._index; }
    set index(index : number) { this._index = index; }

    get id() : number { return this._id; }
    set id(id : number) { this._id = id; }
    /**
     * Angular2 currently does not suport iterating over a map, this is one way to get it to work anyway.
     * https://github.com/angular/angular/issues/2246
     */
    keys()
    {
        return Object.keys(this.routes);
    }
}

/**
 * A class to build a sidebar section
 */
class Builder
{
    private build;
}