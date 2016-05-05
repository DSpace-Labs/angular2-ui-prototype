import {Bitstream} from "../models/bitstream.model";

/**
 * An interface representing all the constituents that make up a the homepage 
 * of a DSOContainer (a Collection or a Community)
 */
export interface ContainerHomepage {

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
     * The sidebar text: HTML
     */
    sidebarText: string;

}
