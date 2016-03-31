import {DSpaceObject} from "./dspaceobject.model";

export class Bitstream extends DSpaceObject {
    retrieveLink: string;

    constructor(json:any) {
        super(json);
        if (json && json.retrieveLink) {
            //TODO add proper way to get absolute links
            this.retrieveLink = `http://localhost:5050/rest/${json.retrieveLink}`;
        }
    }
}