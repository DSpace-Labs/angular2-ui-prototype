import { DSpaceObject } from "./dspace-object.model";
import { ObjectUtil } from "../../utilities/commons/object.util";
import { StringUtil } from "../../utilities/commons/string.util";

import { Metadatum } from './metadatum.model';

/**
 * A model class for a single metadata record.
 */
export class FullMetadatum extends Metadatum {

    /**
     * The schema for this Metadatum. e.g. 'dc'
     */
    schema: string;

    /**
     * The element for this Metadatum. e.g. 'contributor'
     */
    element: string;

    /**
     * The qualifier for this Metadatum. e.g. 'author'
     */
    qualifier: string;

    /**
     * The DSpaceObject this object is metadata for
     */
    dso: DSpaceObject;

    /**
     * Create a new Metadatum.
     * 
     * @param dso
     *      The DSpaceObject this object is metadata for
     * @param json
     *      A plain old javascript object representing a Metadatum as would be returned from the 
     *      REST api. It uses json.key (which consists of schema.element.qualifier), json.value 
     *      and json.language
     */
    constructor(dso: DSpaceObject, json?: any) {
    	super(json);
        if (ObjectUtil.isNotEmpty(json)) {
            let keyArray = json.key.split('.');
            this.schema = keyArray[0] ? keyArray[0] : null;
            this.element = keyArray[1] ? keyArray[1] : null;
            this.qualifier = keyArray[2] ? keyArray[2] : null;

        }
        this.dso = dso;
    }

}