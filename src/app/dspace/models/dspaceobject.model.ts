import {Metadatum} from "./metadatum.model";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";

export class DSpaceObject {
    id: string;
    name: string;
    handle: string;
    link: string;
    type: string;
    metadata: Metadatum[];

    constructor(json?: any) {
        if (ObjectUtil.isNotEmpty(json)) {
            this.id = json.id;
            this.name = json.name;
            this.handle = json.handle;
            this.link = json.link;
            this.type = json.type;
            if (Array.isArray(json.metadata)) {
                this.metadata = json.metadata.map((metadatumJSON) => {
                    return new Metadatum(this, metadatumJSON);
                })
            }
        }
    }
}