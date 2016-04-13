import {DSpaceObject} from "./dspaceobject.model";
import {Bitstream}from './bitstream.model';
import {Metadatum}from './metadatum.model';
import {Collection}from './collection.model';


/**
 * A model class for an Item
 * Item has bitstreams, metadatum, collections..
 */
export class Item extends DSpaceObject {


    /**
     * An item has: - metadata
     *              - bitstreams
     *              - collections
     */



    bitstreams : Bitstream[] = [];
    //metadata: Metadatum[] = [];
    parentCollection : Collection;

    constructor(public jsonitem: any)
    {

        if(jsonitem==null)
        {
            super();
        }
        else
        {
            super(jsonitem); // creates the metadata for us. Also contains ID, link, etc.
            console.log("parsing.. " + jsonitem);
            this.parseBitstreams();
            console.log("parsed bitstreams");
            console.log(this.bitstreams);
          //  this.parseCollection();;
        }

    }

    private parseBitstreams()
    {
        for(let i = 0; i < this.jsonitem.bitstreams.length;i++)
        {
            let bitstreamdata = this.jsonitem.bitstreams[i];
            let bitstream = new Bitstream(bitstreamdata);
            this.bitstreams.push(bitstream);
        }
    }


    private parseCollection()
    {
        this.parentCollection = new Collection(this.jsonitem.parentCollection);
    }


    constructor() // create empty object, not based on json.
    {
        super();
    }

    filterMetadata(keys : String[], metadata)
    {
        // partial data
        var jsonArr = {};
        var data = [];
        jsonArr.metadata = data;


        for(var i : number = 0; i < metadata.length; i++)
        {
            var metadatum = metadata[i];
            if(keys.indexOf(metadatum.key) > -1)
            {
                console.log("contains key");
                var md = {
                    "key" : metadatum.key,
                    "value" : metadatum.value
                }
                data.push(md);
            }
        }

        return jsonArr;
    }

    /**
     * Gets a single metadata value
     * @param key
     */
    getMetadataValue(key: String) : String
    {
        return null;
    }
}