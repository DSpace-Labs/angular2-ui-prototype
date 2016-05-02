import {DSpaceObject} from "./dspaceobject.model";
import {ObjectUtil} from "../../utilities/commons/object.util";
import {StringUtil} from "../../utilities/commons/string.util";

import {Metadatum} from './metadatum.model'

export class MetadatumInput extends Metadatum {

    gloss: string;

    input: string; //TODO: convert to ENUM

    repeatable: boolean;

    validation: any;

    default: any;

    constructor(json: any) {
       super(json);
       if (ObjectUtil.isNotEmpty(json)) {
            this.gloss = json.gloss;
            this.input = json.input;
            this.repeatable = json.repeatable;
            this.validation = json.validation;
            this.default = json.default;
        }
    }

}
