import * as hash from 'object-hash';
import { Equatable} from "../../../utilities/lang/equatable.interface";
import { Hashable } from "../../../utilities/lang/hashable.interface";
import { ObjectUtil } from '../../../utilities/commons/object.util';
import { User } from './../user.model';

/**
 * Extension to the sidebarsection which uses routes
 *
 */
export class SidebarSection implements Hashable, Equatable<SidebarSection>
{


    // The class variables are set to null for hash

    /**
     * This string can be used to overwrite a component.
     */
    id : string =  null;

    /**
     * The order for which an item appears in the sidebar.
     * When a collision, we will see what the sort returns.
     */
    index : number = null;


    /**
     * Name of the component
     */
    componentName : string = null;

    /**
     * Boolean to toggle visibility
     * @type {boolean}
     */
    visible : boolean = true;


    /**
     * If one is passed, we want to observe this for changes
     */
    visibilityObserver : any;



    /**
     * The childsections this section contains
     * @type {any[]}
     */
    childsections : Array<SidebarSection> = new Array<SidebarSection>(); // children of this model.


    /**
     *
     */
    lastObservedValue : any;


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
     */
    startObserving()
    {
        if(this.visibilityObserver != null)
        {
            this.visibilityObserver.subscribe(obs =>
            {
                // Well, this solution makes it a lot less usable.
                // need to implement something like 'ObjectUtil.equals' and make sure all models implement 'Equatable'
                // note: typescript does not support boolean ^ boolean
                if(obs instanceof User !== (this.lastObservedValue instanceof User))
                {
                    this.visible = !this.visible;
                    this.lastObservedValue = obs;
                }
            });
        }
    }

    // interface methods


    /**
     *
     */
    Routes : Array<Route>;


    url : string;

    /**
     *
     */
    constructor()
    {
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

    /**
     * Returns a SHA1 hash of this object, provided by the object-hash library
     *
     * @returns {string}
     *      a SHA1 hash of this object
     */
    hashCode(): string {
        return hash(this);
    }


    /**
     * Returns true if the two sidebar-section models have the same hashcode
     * @param other
     * @returns {boolean}
     */
    equals(other: SidebarSection) : boolean{
        return ObjectUtil.hasValue(other) && this.hashCode() === other.hashCode();
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
        this.section.startObserving();
        return this.section;
    }
}
