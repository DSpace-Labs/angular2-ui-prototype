import { DSpaceObject } from "./dspaceobject.model";
import { ObjectUtil } from "../../utilities/commons/object.util";
import { StringUtil } from "../../utilities/commons/string.util";
import { URLHelper } from "../../utilities/url.helper";

/**
 * A model class for a Bitstream. Bitstreams represent files in DSpace.
 */
export class Bitstream extends DSpaceObject {

    /**
     * A link that can be used to download the file this Bitstream represents.
     */
    retrieveLink: string;

    /**
     *
     */
    format: string;

    /**
     *
     */
    sizeBytes: number;

    /**
     *
     */
    bundleName: string = "ORIGINAL";
    
    size: number;
    
    name: string;

    bundle : string;
    /**
     *
     */
    mimeType: string;

    /**
     * Create a new bitstream
     *
     * @param json
     *      A plain old javascript object representing a bitstream as would be returned
     *      from the rest api. Currently only json.retrieveLink is used, apart from
     *      the standard DSpaceObject properties
     */
    constructor(json?: any) {
        super(json);
        this.type = "bitstream";
        if (ObjectUtil.isNotEmpty(json)) {
            this.format = json.format;
            this.sizeBytes = json.sizeBytes;
            this.bundleName = json.bundleName;
            this.mimeType = json.mimeType;
            if (StringUtil.isNotBlank(json.retrieveLink)) {
                this.retrieveLink = URLHelper.relativeToAbsoluteRESTURL(json.retrieveLink);
                this.format = json.mimeType;
                this.size = json.sizeBytes;
                this.bundle = json.bundleName;
            }
        }
    }

    /**
     *
     */
    getName(): string {
        return this.name;
    }

}
