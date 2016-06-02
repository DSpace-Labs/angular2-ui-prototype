import * as hash from 'object-hash';
import { Equatable} from "../../../utilities/lang/equatable.interface";
import { Hashable } from "../../../utilities/lang/hashable.interface";
import { ObjectUtil } from '../../../utilities/commons/object.util';
import { User } from './../user.model';
import {ArrayUtil} from "../../../utilities/commons/array.util";

/**
 * One SidebarSection is equal to one entry in the sidebar
 * This section can contain a Route, a URL, or neither.
 * When the Section contains neither a Route nor a URL, it's a "header" to the sidebar
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
     *
     */
    isDirty : any; // checks to see if we need to run the code for our visible parameter again.
                   // this is our observable that we used to have.

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
     * Used by the startObserving method, because the logging in/out events generate two events per action
     * We want to avoid changing the visibility twice for one change to the authorization
     */
    lastObservedValue : any;



    /**
     * An array of the routes.
     * This may contain child-routers and routeparams
     */
    routes : Array<Route>;


    /**
     *
     */
    url : string;


    /**
     * function that executes the visibility check
     */
    testFunction : any;


    /**
     * Observable to know when the value has changed, and we need to check for the visibility
     */
    dirtyObservable : any;

    /**
     * The actual test to know if the new value is a reason to check the visibility.
     * By default we will check on each event, hence the 'return true'.
     */
    dirtyTest : any = ( () => {return true;});

    /**
     * Add a childsection
     * @param child
     */
    addChild(child : SidebarSection)
    {
        this.childsections.push(child);
    }

    /**
     * Start observing the observalble/subject (can be either one of them)
     */
    startObservingDirty()
    {
        this.visible = this.testFunction();
        this.dirtyObservable.subscribe(change =>
        {
            if (this.dirtyTest()) {
                this.visible = this.testFunction();
            }
        });
    }

    // interface methods

    /**
     * Optionally construct the object from json data.
     * This will be used to load saved SidebarSections from disk
     * Otherwise they would just be added to the SidebarService as 'object' instead of 'SidebarSection'
     * @param json
     */
    constructor(json? : any)
    {
        if(json) // if we have received json input
        {
            this.id = json.id;
            this.componentName = json.componentName;
            this.url = json.url;
            // just do this for one level now, to test.
            // Otherwise, if we simply assing this.chilsections to json.childsections, they will be of type 'object'
            if(ArrayUtil.isNotEmpty(json.childsections)){

                json.childsections.forEach(x =>
                {
                    let y = new SidebarSection(x);
                    this.childsections.push(y);
                });

            }
        }
        this.routes = new Array<Route>()
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
        let simpleHash=  <any>hash; // cast to 'any' so typscript does not complain about the options not being defined'
        let hashcode = simpleHash(this, {algorithm: 'passthrough'});
        return hashcode;
    }


    /**
     * Returns true if the two sidebar-section models have the same hashcode
     * Their hashcode will be the same if the content of their class variables is identical.
     *
     * @param other
     * @returns {boolean}
     */
    equals(other: SidebarSection) : boolean{
        return ObjectUtil.hasValue(other) && this.hashCode() === other.hashCode();
    }

}


/**
 * A class to store the routing information for a section.
 */
class Route
{

    /**
     *
     * @param name
     *      the name of the route, as it appears in the RouteConfig
     * @param params
     *  params are the expected parameters for the given route, as they appear in the RouteConfig (e.g, an item ID, collection ID, ..)
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
     * Custom prefix for user-added components.
     * @type {string}
     */
    prefix : string = "custom-section-";

    /**
     *
     */
    private section : SidebarSection;

    /**
     * Indicates whether or not an ID needs to be generated, or is provided by the user.
     * In the default case, one is provided in code.
     * The only time we would, at the moment, generate one oursevles is for the 'admin menu'.
     * @type {boolean}
     */
    private generateId = false;

    /**
     * Create a new SidebarSection object.
     */
    constructor()
    {
        this.section = new SidebarSection();
    }

    /**
     *
     * @param generate
     * @returns {Builder}
     */
    generateUserID(generate : boolean) : Builder{
        this.generateId = generate;
        return this;
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
     * @param observable
     * @returns {Builder}
     */
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
     *      name is name of the route, as it appears in the RouteConfig
     * @param params
     *      params are the provided parameters expected for a given route, as they appear in the RouteConfig
     * @returns {Builder}
     */
    route(name : string, params?)
    {
        let childRoute = new Route(name,params);
        this.section.routes.push(childRoute);
        return this;
    }

    /**
     * 
     * @param code
     * @returns {Builder}
     */
    testFunction(code : any) : Builder // pass the code for our visibility Observable.
    {
        this.section.testFunction = code;
        return this;
    }

    /**
     * 
     * @param observable
     * @returns {Builder}
     */
    dirtyObservable(observable: any) : Builder
    {
        // we need an observable to observe
        this.section.dirtyObservable = observable;
        return this;
    }

    /**
     * overwrites the default dirty check (which just returns true)
     * @param code
     * @returns {Builder}
     */
    dirtyTest(code : any) : Builder
    {
        this.section.dirtyTest = code;
        return this;
    }
    /**
     *
     * @param destination
     */
    url(destination : string) : Builder
    {
       this.section.url = destination;
        return this;
    }


    /**
     * returns a generated ID, with a set prefix.
     * The current time in ms is used to generate the section ID.
     * @returns {string}
     */
    private generateID() : string
    {
        let generatedId : string = this.prefix + new Date().getTime();
        return generatedId;
    }

    /**
     * Returns the sidebar section and starts the observable
     * @returns {SidebarSection}
     */
    build() : SidebarSection
    {
        if(this.section.testFunction != null)
        {
            this.section.visible = this.section.testFunction();
            this.section.startObservingDirty();
        }
        if(this.generateId)
        {
            this.section.id = this.generateID();
        }
        return this.section;
    }
}
