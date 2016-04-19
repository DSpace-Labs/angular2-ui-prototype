import {Item} from "./item.model";
import {DSOContainer} from "./dso-container.model";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";

/**
 * A model class for a Collection
 */
export class Collection extends DSOContainer {
    /**
     * An array of the Items in this Collection
     */
    items: Item[];


    /**
     * Create a new Collection
     *
     * @param json
     *      A plain old javascript object representing a Collection as would be returned from the
     *      REST API. Currently only json.items is used, apart from the standard DSpaceObject
     *      properties
     */
    constructor(json:any, parseItems? : boolean) {
        if(parseItems==null)
        {
            parseItems=true;
        }
        super(json);
        if(ObjectUtil.isNotEmpty(json) && Array.isArray(json.items) && parseItems) {
            this.items = json.items.map((jsonitem) => {
                return new Item(jsonitem);
            });

;
        }
    }
}