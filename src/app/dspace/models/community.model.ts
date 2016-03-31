import {Collection} from "./collection.model";
import {DSOContainer} from "./dso-container.model";
// import * as _ from 'underscore';
const _ = require('underscore'); //see: https://github.com/preboot/angular2-webpack/issues/9#issuecomment-170404632

export class Community extends DSOContainer {
    collections: Collection[];
    subCommunities: Community[];

    constructor(json?: any) {
        super(json);

        if (json) {
            if (_.isArray(json.collections)) {
                this.collections = _.map(json.collections, (collectionJSON) => {
                    return new Collection(collectionJSON);
                })

            }
            if (_.isArray(json.subcommunities)) {
                this.subCommunities = _.map(json.collections, (subCommunityJSON) => {
                    return new Community(subCommunityJSON);
                })
            }
        }
    }
}