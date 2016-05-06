import {DSOContainer} from "./dso-container.model";
import {Bitstream}from './bitstream.model';
import {Metadatum}from './metadatum.model';
import {Collection}from './collection.model';
import {ObjectUtil} from "../../utilities/commons/object.util";
import {URLHelper} from "../../utilities/url.helper";

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
     * If this bitstream is a thumbnail, save the string to the thumbnail.
     */
    private findThumbnail(bitstreams)
    {
        if(bitstreams != null)
        {
            let primaryBitstream = this.getPrimaryStream(bitstreams);
            if (primaryBitstream != null)
            {
                bitstreams.filter(bstream => bstream.bundleName == "THUMBNAIL" && bstream.name == primaryBitstream.name + ".jpg")
                          .forEach(result => this.thumbnail = URLHelper.relativeToAbsoluteRESTURL(result.retrieveLink)); // if filter returns, it will be the first one.
            }
        }
    }

    /**
     * Returns the primary bitstream
     * @param bitstreams
     * @returns Bitstream
     */
    private getPrimaryStream(bitstreams) : Bitstream
    {
        var primary = bitstreams.filter(x => x.bundleName=="ORIGINAL" && x.sequenceId == 1);
        return primary != null ? primary[0] : null;
    }
}