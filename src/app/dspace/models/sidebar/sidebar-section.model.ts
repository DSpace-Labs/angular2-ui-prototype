import * as hash from 'object-hash';
import { Equatable} from "../../../utilities/lang/equatable.interface";
import { Hashable } from "../../../utilities/lang/hashable.interface";
import { ObjectUtil } from '../../../utilities/commons/object.util';
import { User } from './../user.model';

/**
 * A class representing a sidebar section
 *
 * Implements the hashable interface:
 *  SidebarSection objects with the same attributes will have an identical hashcode
 *
 * Implements the equatable interface:
 *  SidebarSection objects can be compared with the equals() method
 *  two sidebarsection objects with the same hashcode are equal
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
     * Add a childsection
     * @param child
     */
    addChild(child : SidebarSection)
    {
        this.childsections.push(child);
    }




    lastObservedValue : any;

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

