import {Metadatum} from "./metadatum.model";
import * as _ from 'underscore';

export class DSpaceObject {
    id: string;
    name: string;
    handle: string;
    link: string;
    type: string;
    metadata: Metadatum[];

    constructor(json?: any) {
        if (json) {
            this.id = json.id || null;
            this.name = json.name || null;
            this.handle = json.handle || null;
            this.link = json.link || null;
            this.type = json.type || null;
            if (_.isArray(json.metadata)) {
                this.metadata = _.map(json.metadata, (metadatumJSON) => {
                    return new Metadatum(this, metadatumJSON);
                })
            }
        }
    }
}