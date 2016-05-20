import { SidebarSection } from './sidebar-section.model';


/**
 * Extension to the sidebarsection which uses routes
 *
 */
export class RouteSidebarSection extends SidebarSection
{

    /**
     *
     */
    Routes : Array<Route>;


    /**
     *
     */
    constructor()
    {
        super();
        this.Routes = new Array<Route>()
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
 *
 */
class Route
{

    /**
     *
     * @param name
     * @param params
     */
    constructor(public name : string, params?)
    {
        if(params!=null)
        {
            this.params = params;
        }
    }
    params : any[];
}


/**
 * A class to build a sidebar section
 */
class Builder
{

    /**
     *
     */
    private section : RouteSidebarSection;

    /**
     *
     */
    constructor()
    {
        this.section = new RouteSidebarSection();
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

    visibilityObservable(observable : any) : Builder
    {
        this.section.visibilityObserver = observable;
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
     * @param children
     * @returns {Builder}
     */
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
     * @param name
     * @param params
     * @returns {Builder}
     */
    route(name, params?)
    {
        let childRoute = new Route(name,params);
        this.section.Routes.push(childRoute);
        return this;
    }

    /**
     * // initiate the observable
     * @returns {SidebarSection}
     */
    build() : SidebarSection
    {
        console.log("starting observable");
        this.section.startObserving();
        return this.section;
    }
}
