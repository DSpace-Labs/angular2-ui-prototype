import {DSpaceObject} from "./dspaceobject.model";
import {ObjectUtil} from "../../utilities/commons/object.util";
import {StringUtil} from "../../utilities/commons/string.util";

/**
 * A model class for a single metadata record.
 */
export class Metadatum {

    // if really want to decomposed key should be a new class that extends Metadatum
    // There should be a base class that represents the API response in respect that
    // the API should accept the same object in a POST

    /**
     * The schema for this Metadatum. e.g. 'dc'
     */
    //schema: string;

    /**
     * The element for this Metadatum. e.g. 'contributor'
     */
    //element: string;

    /**
     * The qualifier for this Metadatum. e.g. 'author'
     */
    //qualifier: string;

    /**
     * The key for this Metadatum. e.g. 'dc.contributor.author'
     */
    key: string;

    /**
     * The value for this Metadatum. e.g. 'Smith, Donald Jr.'
     */
    value: string;

    /**
     * The language for this Metadatum. e.g. 'en_US'
     */
    language: string;

    /**
     * The DSpaceObject this object is metadata for
     */
    //dso: DSpaceObject;

    /**
     * Create a new Metadatum.
     * 
     * @param json
     *      A plain old javascript object representing a Metadatum as would be returned from the 
     *      REST api. It uses json.key (which consists of schema.element.qualifier), json.value 
     *      and json.language
     */
    constructor(json?: any) {
        if (ObjectUtil.isNotEmpty(json)) {
            this.key = json.key;
            this.value = json.value;
            this.language = json.language;
            //this.dso = json.dso;
        }
    }

    get schema(): string {
        let parts = this.key.split('.');
        return parts[0] ? parts[0] : null;
    }

    get element(): string {
        let parts = this.key.split('.');
        return parts[1] ? parts[1] : null;
    }

    get qualifier(): string {
        let parts = this.key.split('.');
        return parts[2] ? parts[2] : null;
    }

    /**
     * Get the key for this Metadatum as a single string.
     * 
     * @returns {string}
     *      schema.element.qualifier
     */
    //get key(): string {
    //    return [this.schema, this.element, this.qualifier].filter((value: string) => {
    //        return StringUtil.isNotBlank(value);
    //    }).join('.');
    //}

    /**
     * Set the key for this Metadatum with a single string.
     * 
     * @param key
     *      should be in the format schema.element.qualifier
     */
    //set key(key: string) {
    //    if (StringUtil.isBlank(key)) {
    //        this.schema = this.element = this.qualifier = null;
    //    }
    //    else {
    //        let keyArray = key.split('.');
    //        this.schema = keyArray[0];
    //        this.element = keyArray[1];
    //        this.qualifier = keyArray[2];
    //    }
    //}

}
