import {DSOContainer} from "./dso-container.model";
import {Bitstream}from './bitstream.model';
import {Metadatum}from './metadatum.model';
import {Collection}from './collection.model';
import {ObjectUtil} from "../../utilities/commons/object.util";
import {ArrayUtil} from "../../utilities/commons/array.util";
import {URLHelper} from "../../utilities/url.helper";



/**
 * A model class for an Item. Item has bitstreams, metadata, collections...
 */
export class Item extends DSOContainer {

    /**
     *
     */
    bitstreams : Array<Bitstream> = new Array<Bitstream>();

    /**
     *
     */
    parentCollection : Collection;

    /**
     *
     */
    lastModified: string; //TODO: change to date, deserialize

    /**
     *
     */
    archived: boolean;

    /**
     *
     */
    withdrawn: boolean;

    /**
     *
     */
    fullItem: boolean;



    /*
     * thumbnail url, including the rest url
     */
    thumbnail : string; // url representing the primary thumbnail

    thumbnails : { [name:string] : string} = {}; // all the thumbnails of this item.


    /**
     * Create a new DSpaceObject.
     *
     * @param json
     *      A plain old javascript object representing an Item as would be returned
     *      from the REST api. It uses json.parentCollection, json.lastModified, json.archived, 
     *      json.withdrawn, and json.bitstreams
     */
    constructor(json?: any) { // this could be either an item, or json.
        super(json); // Creates a DSpaceObject with some of the information about this item (name,id,..)
        this.findThumbnail(json.bitstreams);
        if (ObjectUtil.isNotEmpty(json))
        {
            this.parentCollection = new Collection(json.parentCollection);
            this.lastModified = json.lastModified;
            this.archived = json.archived;
            this.withdrawn = json.withdrawn;
            this.fullItem = json.fullItem ? json.fullItem : false;


            if (Array.isArray(json.bitstreams)) {
                this.bitstreams = json.bitstreams.map((bitstream) => {
                    return new Bitstream(bitstream);
                });
            }
        }
    }


    /**
     * Add to metadata array of DSO.
     * Uses a temparray to trigger the change detection of angular.
     * @param metadata
     */
    addMetadata(metadata? : Metadatum)
    {
        if(this.metadata == null)
        {
            this.metadata = new Array<Metadatum>();
        }
        // slice, shallow copy, but new array object. We want a new array for angular's change detection.
        let tempArray = this.metadata.slice(0);
        tempArray.push(metadata);
        this.metadata = tempArray;
    }

    /**
     * If this bitstream is a thumbnail, save the string to the thumbnail.
     */
    private findThumbnail(bitstreams: Array<jsonbitstream>)
    {
        if(bitstreams != null)
        {
            let primaryStream = this.getPrimaryStream(bitstreams);
            bitstreams.filter(x => x.bundleName == "THUMBNAIL").forEach(x =>
            {
                this.thumbnails[x.name.substr(0,x.name.length-".JPG".length)] = URLHelper.relativeToAbsoluteRESTURL(x.retrieveLink);

                if (x.name == primaryStream.name+".jpg")
                {
                    this.thumbnail = URLHelper.relativeToAbsoluteRESTURL(x.retrieveLink);
                }
            });
        }
    }

    /**
     * Returns the primary bitstream
     * @param bitstreams
     * @returns Bitstream
     */
    private getPrimaryStream(bitstreams: Array<jsonbitstream>) : jsonbitstream
    {

        var primary = ArrayUtil.findBy(bitstreams,'bundleName','ORIGINAL');
        return primary != null ? primary : null;
    }

    /**
     *
     */
    getBitstreamsByBundleName(bundleName: string): Array<Bitstream> {
        return ArrayUtil.filterBy(this.bitstreams, 'bundleName', bundleName);
    }

    /**
     *
     */
    sanatize(): void {
        super.sanatize();
        this.fullItem = undefined;
    }
    
    
}

/**
 * To let typescript recognize the datatypes that we expect to get from the json
 */
interface jsonbitstream{
    name : string;
    bundleName : string;
    sequenceId : number;
    retrieveLink: string;
}
 

