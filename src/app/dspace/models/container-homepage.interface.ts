import {Bitstream} from "./bitstream.model";

export interface IContainerHomepage {
    logo: Bitstream;
    copyrightText: string;
    introductoryText: string;
    shortDescription: string;
    news: string;
}