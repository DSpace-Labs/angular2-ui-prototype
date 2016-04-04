import {Item} from "./item.model";
import {DSOContainer} from "./dso-container.model";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";

export class Collection extends DSOContainer {
    items: Item[];


    constructor(json:any) {
        super(json);

        if(ObjectUtil.isNotEmpty(json) && Array.isArray(json.items)) {
            this.items = json.items.map((itemJSON) => {
                return new Item(itemJSON);
            });
        }
    }
}