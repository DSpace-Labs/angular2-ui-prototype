import {DSpaceObject} from "./dspaceobject.model";
import {Bitstream} from "./bitstream.model";
import {IContainerHomepage} from "./container-homepage.interface";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";

export class DSOContainer extends DSpaceObject implements IContainerHomepage {
    logo:Bitstream;
    copyrightText:string;
    introductoryText:string;
    shortDescription:string;
    news:string;
    countItems: number;


    constructor(json:any) {
        super(json);
        if (ObjectUtil.isNotEmpty(json)) {
            this.copyrightText = json.copyrightText;
            this.introductoryText = json.introductoryText;
            this.shortDescription = json.shortDescription;
            this.news = json.sidebarText;
            this.countItems = json.countItems;
            if (json.logo) {
                this.logo = new Bitstream(json.logo);
            }
        }
    }
}