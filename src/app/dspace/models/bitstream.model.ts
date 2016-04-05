import {DSpaceObject} from "./dspaceobject.model";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";
import {StringUtil} from "../../utilities/commons/string.util.ts";

/**
 * A model class for a Bitstream
 * Bitstreams represent files in DSpace
 */
export class Bitstream extends DSpaceObject {
    /**
     * A link that can be used to download the file this Bitstream represents.
     */
    retrieveLink: string;

    /**
     * Create a new bitstream
     *
     * @param json
     *      A plain old javascript object representing a bitstream as would be returned 
     *      from the rest api. Currently only json.retrieveLink is used, apart from
     *      the standard DSpaceObject properties
     */
    constructor(json:any) {
        super(json);
        if (ObjectUtil.isNotEmpty(json) && StringUtil.isNotBlank(json.retrieveLink)) {
            //TODO add proper way to get absolute links
            this.retrieveLink = `http://localhost:5050/rest/${json.retrieveLink}`;
        }
    }
}