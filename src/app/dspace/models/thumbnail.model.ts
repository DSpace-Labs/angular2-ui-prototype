import { DSpaceObject } from "./dspaceobject.model";
import { ObjectUtil } from "../../utilities/commons/object.util";
import { StringUtil } from "../../utilities/commons/string.util";
import { URLHelper } from "../../utilities/url.helper";

/**
 * A model class representing a thumbnail
 */
export class Thumbnail{


    /**
     * Link to retrieve this thumbnail
     */
    retrieveLink : string;

    /**
     * The name of the item this thumbnail belongs to. (Thumbnail - jpg)
     */
    name: string;

    constructor(json?: any)
    {

    }
}
