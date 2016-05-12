
// TODO: fix the used style guide.
export class SidebarSection
{

    /**
     * This number can be used to overwrite a component.
     */
    id : number;

    /**
     * The order for which an item appears in the sidebar.
     * When a collision, we will see what the sort returns.
     */
    index : number;


    /**
     * Name of the component
     */
    componentName : string;

    /**
     * Boolean to toggle visibility
     * @type {boolean}
     */
    visible : boolean = true;

    /**
     * The childsections this section contains
     * @type {any[]}
     */
    childsections : Array<SidebarSection> = new Array<SidebarSection>(); // children of this model.


    /**
     * A map of routes.
     * A route contains a name (to display), and a routing-name (name as it appears in the router).
     * Name should be an i18n string.
     * @type {{}}
     */
    private routes : { [name:string] : string } = {};


    /**
     *
     */
    constructor()
    {
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
        this.routes = routes;
    }


    /**
     * Add a childsection
     * @param child
     */
    addChild(child : SidebarSection)
    {
        this.childsections.push(child);
    }

    /**
     * Angular2 currently does not suport iterating over a map, this is one way to get it to work anyway.
     * https://github.com/angular/angular/issues/2246
     */
    keys()
    {
        return Object.keys(this.routes);
    }

    /**
     *
     * @returns {Builder}
     */
    static getBuilder() : Builder
    {
        return new Builder();
    }

}


/**
 * A class to build a sidebar section
 */
class Builder
{

    /**
     *
     */
    private section : SidebarSection;

    /**
     *
     */
    constructor()
    {
        this.section = new SidebarSection();
    }

    /**
     *
     * @param id
     * @returns {Builder}
     */
    id(id : number) : Builder
    {
        this.section.id = id;
        return this;
    }

    /**
     *
     * @param name
     * @returns {Builder}
     */
    name(name : string) : Builder
    {
        this.section.componentName = name;
        return this;
    }

    /**
     *
     * @param index
     * @returns {Builder}
     */
    index(index : number) : Builder
    {
        this.section.index = index;
        return this;
    }

    /**
     *
     * @param visible
     * @returns {Builder}
     */
    visible(visible : boolean) : Builder
    {
        this.section.visible = visible;
        return this;
    }

    /**
     *
     * @param routes
     * @returns {Builder}
     */
    routes(routes) : Builder
    {
        this.section.addRoutes(routes);
        return this;
    }

    /**
     *
     * @param name
     * @param url
     * @returns {Builder}
     */
    route(name : string, url : string) : Builder
    {
        this.section.addRoute(name,url);
        return this;
    }

    /**
     *
     */
    resetBuild() : void
    {
        // empty what is already set, reuse this builder object to build new component
        this.section = new SidebarSection();
    }

    /**
     *
     * @param child
     * @returns {Builder}
     */
    addChild(child : SidebarSection) : Builder
    {
        this.section.addChild(child);
        return this;
    }

    /**
     *
     * @returns {SidebarSection}
     */
    build() : SidebarSection
    {
        return this.section;
    }
}
