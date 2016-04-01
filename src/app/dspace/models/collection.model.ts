import {Item} from "./item.model";
import {DSOContainer} from "./dso-container.model";
import * as _ from 'underscore';

export class Collection extends DSOContainer {
    items: Item[];


    constructor(json:any) {
        super(json);

        if(json && _.isArray(json.items)) {
            this.items = _.map(json.items, (itemJSON) => {
                return new Item(itemJSON);
            });
        }
    }
}