export class SidebarSection
{

    /**
     * This string can be used to overwrite a component.
     */
    id : string;

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
     * The route of this component as it appears in the router
     * If this does not match the name in the router, Angular2 will throw an error.
     */
    route: string;


    /**
     *
     */
    routeid : number;


    /**
     * The childsections this section contains
     * @type {any[]}
     */
    childsections : Array<SidebarSection> = new Array<SidebarSection>(); // children of this model.




    /**
     *
     */
    constructor()
    {
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
    id(id : string) : Builder
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
     * @param name
     * @param url
     * @returns {Builder}
     */
    route(route : string) : Builder
    {
        this.section.route = route;
        return this;
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
     * @param id
     * @returns {Builder}
     */
    routeid(id : number) : Builder
    {
        this.section.routeid = id;
        return this;
    }

    addChildren(children : Array<SidebarSection>) : Builder
    {
        for(let child of children)
        {
            this.section.addChild(child);
        }
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
