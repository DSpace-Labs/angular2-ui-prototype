import {DSpaceObject} from "./dspaceobject.model";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";
import {StringUtil} from "../../utilities/commons/string.util.ts";

export class Bitstream extends DSpaceObject {
    retrieveLink: string;

    constructor(json:any) {
        super(json);
        if (ObjectUtil.isNotEmpty(json) && StringUtil.isNotBlank(json.retrieveLink)) {
            //TODO add proper way to get absolute links
            this.retrieveLink = `http://localhost:5050/rest/${json.retrieveLink}`;
        }
    }
}