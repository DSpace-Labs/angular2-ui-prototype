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

    constructor(json: any) { // would be resolved to an object at this point.
        super(json); // Creates a DSpaceObject with some of the information about this item (name,id,..)
            // here we should hav the same data

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
                    let b : Bitstream = new Bitstream(bitstream);
                    return b;
                });
            }
        }
    }

    /**
     * If this bitstream is a thumbnail, save the string to the thumbnail.
     * Returns null if none is found;
     * @returns {null}
     */
    private findThumbnail(bitstreams)
    {
        let primaryBitstream = this.getPrimaryStream(bitstreams);
        console.log("primary bitstream: " + primaryBitstream.name);
        var x = bitstreams.filter(x => x.bundleName == "THUMBNAIL" && x.name == primaryBitstream.name+".jpg").forEach(x => this.thumbnail = x.retrieveLink);
        console.log("thumbnail..");
        console.log(this.thumbnail);
    }

    private getPrimaryStream(bitstreams) : Bitstream
    {
        console.log("looking for the primary bitstream name");
        var x = bitstreams.filter(x => x.bundleName=="ORIGINAL" && x.sequenceId == 1)[0];
        console.log(x);
        return x;
    }
}