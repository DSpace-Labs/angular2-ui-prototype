import {Item} from "./item.model";
import {DSOContainer} from "./dso-container.model";
// import * as _ from 'underscore';
const _ = require('underscore'); //see: https://github.com/preboot/angular2-webpack/issues/9#issuecomment-170404632

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