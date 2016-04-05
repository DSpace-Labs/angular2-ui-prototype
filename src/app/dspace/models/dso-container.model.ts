import {DSpaceObject} from "./dspaceobject.model";
import {Bitstream} from "./bitstream.model";
import {IContainerHomepage} from "./container-homepage.interface";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";

/**
 * An abstract model class for a DSOContainer, which is a DSpace Object that acts as a container for 
 * others and has a homepage (a Community or a Collection)
 */
export abstract class DSOContainer extends DSpaceObject implements IContainerHomepage {
    /**
     * The logo: a Bitstream
     */
    logo: Bitstream;

    /**
     * The copyright text: HTML
     */
    copyrightText: string;

    /**
     * The introductory text: HTML
     */
    introductoryText: string;

    /**
     * The short description: HTML
     */
    shortDescription: string;

    /**
     * The news section, also referred to as sidebarText: HTML
     */
    news: string;

    /**
     * The number of items in this DSOContainer
     */
    countItems: number;

    /**
     * Create a new DSOContainer
     *
     * @param json
     *      A plain old javascript object representing a DSOContainer as would be returned
     *      from the rest api. Apart from the standard DSpaceObject properties, it uses 
     *      json.copyrightText, json.introductoryText, json.shortDescription, json.sidebarText, 
     *      json.countItems and json.logo 
     */
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