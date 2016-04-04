import {DSpaceObject} from "./dspaceobject.model";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";
import {StringUtil} from "../../utilities/commons/string.util.ts";

export class Metadatum {
    schema: string;
    element: string;
    qualifier: string;
    value: string;
    language: string;
    dso: DSpaceObject;

    constructor(dso: DSpaceObject, json?: any) {
        if (ObjectUtil.isNotEmpty(json)) {
            this.setKey(json.key);
            this.value = json.value;
            this.language = json.language;
        }
        this.dso = dso;
    }

    getKey() {
        return [this.schema, this.element, this.qualifier].filter((value: string) => {
            return StringUtil.isNotBlank(value);
        }).join('.');
    }

    setKey(key: string) {
        if (StringUtil.isBlank(key)) {
            this.schema = this.element = this.qualifier = null;
        }
        else {
            let keyArray = key.split('.');
            this.schema = keyArray[0];
            this.element = keyArray[1];
            this.qualifier = keyArray[2];
        }
    }

}