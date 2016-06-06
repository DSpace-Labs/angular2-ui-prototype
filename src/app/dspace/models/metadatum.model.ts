import { DSpaceObject } from "./dspace-object.model";
import { ObjectUtil } from "../../utilities/commons/object.util";
import { StringUtil } from "../../utilities/commons/string.util";

/**
 * A model class for a single metadata record.
 */
export class Metadatum {

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
            // TODO: manage default langauge
            this.language = json.language ? json.language : 'en_US';
        }
    }

    /**
     *
     */
    get schema(): string {
        let parts = this.key.split('.');
        return parts[0] ? parts[0] : null;
    }

    /**
     *
     */
    get element(): string {
        let parts = this.key.split('.');
        return parts[1] ? parts[1] : null;
    }

    /**
     *
     */
    get qualifier(): string {
        let parts = this.key.split('.');
        return parts[2] ? parts[2] : null;
    }

}
