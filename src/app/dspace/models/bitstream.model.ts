import {DSpaceObject} from "./dspaceobject.model";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";
import {StringUtil} from "../../utilities/commons/string.util.ts";

/**
 * A model class for a Bitstream
 * Bitstreams represent files in DSpace
 */
export class Bitstream extends DSpaceObject { // The parent object (super) is singleton?
    
     /**
     * A link that can be used to download the file this Bitstream represents.
     */
    retrieveLink: string;
    
    id;
    
    format : string;
    
    size: number;
    
    name: string;
    
    /**
     * Create a new bitstream
     *
     * @param json
     *      A plain old javascript object representing a bitstream as would be returned 
     *      from the rest api. Currently only json.retrieveLink is used, apart from
     *      the standard DSpaceObject properties
     */
    constructor(json?:any) {
        if(json!=null) {
            super(json); // a DSpaceObject does not contain 'retrieveLink', format, size
            if (ObjectUtil.isNotEmpty(json) && StringUtil.isNotBlank(json.retrieveLink)) {
                //TODO add proper way to get absolute links
                this.retrieveLink = `https://demo.dspace.org/rest${json.retrieveLink}`;
                this.format = json.mimeType;
                this.size = json.sizeBytes;
            }
        }
    }

    getName() {
        return this.name;
    }

}