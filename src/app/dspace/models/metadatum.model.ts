import {DSpaceObject} from "./dspaceobject.model";
// import * as _ from 'underscore';
const _ = require('underscore'); //see: https://github.com/preboot/angular2-webpack/issues/9#issuecomment-170404632
const s = require("underscore.string");

export class Metadatum {
    schema: string;
    element: string;
    qualifier: string;
    value: string;
    language: string;
    dso: DSpaceObject;

    constructor(dso: DSpaceObject, json?: any) {
        if (json) {
            this.setKey(json.key);
            this.value = json.value || null;
            this.language = json.language || null;
        }
        this.dso = dso;
    }

    getKey() {
        return _.filter([this.schema, this.element, this.qualifier], (value) => {
            return !s.isBlank(value);
        }).join('.');
    }

    setKey(key: string) {
        if (s.isBlank(key)) {
            this.schema = this.element = this.qualifier = null;
        }
        else {
            let keyArray = s.words(key, '.');
            this.schema = keyArray[0];
            this.element = keyArray[1];
            this.qualifier = keyArray[2];
        }
    }

}