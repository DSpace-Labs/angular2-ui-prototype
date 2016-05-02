import {DSOContainer} from "./dso-container.model";
import {Bitstream}from './bitstream.model';
import {Metadatum}from './metadatum.model';
import {Collection}from './collection.model';
import {ObjectUtil} from "../../utilities/commons/object.util";

/**
 * A model class for an Item. Item has bitstreams, metadata, collections...
 */
export class Item extends DSOContainer {

    bitstreams : Array<Bitstream> = [];

    parentCollection : Collection;

    lastModified: string; //TODO: change to date, deserialize

    archived: boolean;

    withdrawn: boolean;

    fullItem: boolean;

    thumbnail : string; // url to the thumbnail of this item.

    constructor(json: any) {
        super(json); // Creates a DSpaceObject with some of the information about this item (name,id,..)

        if (ObjectUtil.isNotEmpty(json))
        {
            this.parentCollection = new Collection(json.parentCollection);
            this.lastModified = json.lastModified;
            this.archived = json.archived;
            this.withdrawn = json.withdrawn;
            this.fullItem = json.fullItem ? json.fullItem : false;

            if (Array.isArray(json.bitstreams)) {
                this.bitstreams = json.bitstreams.map((bitstream) => {
                    let bitstream : Bitstream = new Bitstream(bitstream);
                    this.hasThumbnail(bitstream);
                    return bitstream;
                });
            }
            if(Array.isArray(json.metadata))
            {
                for(let i : number = 0; i < json.metadata.length; i++)
                {
                    this.metadata.push(new Metadatum(json.metadata[i]));
                }
            }
        }
    }

    /**
     * If this bitstream is a thumbnail, save the string to the thumbnail.
     * Returns null if none is found;
     * @returns {null}
     */
    private hasThumbnail(bitstream) : String
    {
        console.log("does this item have a thumbnail?");
        console.log(bitstream);
        console.log
        return null;
    }
}