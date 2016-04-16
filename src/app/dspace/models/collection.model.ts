import {Item} from "./item.model";
import {DSOContainer} from "./dso-container.model";
import {Community} from "./community.model";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";

/**
 * A model class for a Collection
 */
export class Collection extends DSOContainer {

    /**
     * An array of the Items in this Collection
     */
    items: Array<Item>;
    
    /**
     * Number of items in collection.
     */
    numberItems: number;

    /**
     * Parent community.
     */
    parentCommunity : Community;

    license: string; // TODO: probably should have a license object

    /**
     * Create a new Collection
     *
     * @param json
     *      A plain old javascript object representing a Collection as would be returned from the
     *      REST API. Currently only json.items is used, apart from the standard DSpaceObject
     *      properties
     */
    constructor(json:any, parseItems? : boolean) {
        if(parseItems == null) parseItems = true;
        super(json);
        if(ObjectUtil.isNotEmpty(json) && Array.isArray(json.items) && parseItems) {
            this.numberItems = json.numberItems;
            this.parentCommunity = json.parentCommunity;
            this.items = json.items.map((itemJSON) => {
                return new Item(itemJSON); // Returning new items causes an infinite loop now, for some reason?
            });
        }
    }
}