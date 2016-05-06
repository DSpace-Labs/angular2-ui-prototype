import { ObjectUtil } from "../commons/object.util";

import { Metadatum } from '../../dspace/models/metadatum.model';

/**
 *
 */
export class FormInput extends Metadatum {

    /**
     *
     */
    gloss: string;

    /**
     *
     */
    type: string;

    /**
     *
     */
    options: Array<any>;

    /**
     *
     */
    repeatable: boolean;

    /**
     *
     */
    repeat: number;

    /**
     *
     */
    validation: any;

    /**
     *
     */
    edit: boolean;

    /**
     *
     */
    default: any;

    /**
     * Create a new Metadatum.
     * 
     * @param json
     *      A plain old javascript object representing a MetadatumInput as would be created from the 
     *      form service. It uses json.gloss, json.type, json.options, json.repeat, json.repeatable, 
     *      json.validation, json.edit, and json.default
     */
    constructor(json: any) {
        super(json);
        if (ObjectUtil.isNotEmpty(json)) {
            this.gloss = json.gloss;
            this.type = json.type;
            this.options = json.options;
            this.repeat = json.repeat;
            this.repeatable = json.repeatable;
            this.validation = json.validation;
            this.edit = false;
            this.default = json.default;
        }
    }

    /**
     *
     */
    get id(): string {
        return this.repeat ? this.key + '.' + this.repeat : this.key;
    }

}
