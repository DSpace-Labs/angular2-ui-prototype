import {DSpaceObject} from "./dspaceobject.model";
import {Bitstream} from "./bitstream.model";
import {IContainerHomepage} from "./container-homepage.interface";

export class DSOContainer extends DSpaceObject implements IContainerHomepage {
    logo:Bitstream;
    copyrightText:string;
    introductoryText:string;
    shortDescription:string;
    news:string;
    countItems: number;


    constructor(json:any) {
        super(json);
        if (json) {
            this.copyrightText = json.copyrightText || null;
            this.introductoryText = json.introductoryText || null;
            this.shortDescription = json.shortDescription || null;
            this.news = json.sidebarText || null;
            this.countItems = json.countItems || null;
            if (json.logo) {
                this.logo = new Bitstream(json.logo);
            }
        }
    }
}