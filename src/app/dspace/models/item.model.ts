import {DSpaceObject} from "./dspaceobject.model";
import {Bitstream}from './bitstream.model';


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

    constructor(public jsonitem: any)
    {
        super();
        // For now, deal with the JSON here as long as we pass JSON.
        if(jsonitem!=null)
        this.parseBitstreams();
    }

    private parseBitstreams()
    {
        console.log("parsing bitstreams");
        console.log(this.jsonitem.bitstreams);
        for(let i = 0; i < this.jsonitem.bitstreams.length;i++)
        {
            let bitstreamdata = this.jsonitem.bitstreams[i];
            let bitstream = new Bitstream(null,bitstreamdata.id,bitstreamdata.name,bitstreamdata.retrieveLink,bitstreamdata.format,bitstreamdata.format);
            this.bitstreams.push(bitstream);
        }
    }

    private parseMetadata()
    {

    }

    private parseCollection()
    {

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