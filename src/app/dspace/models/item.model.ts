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
    metadata: Metadatum[] = [];
    parentCollection : Collection;

    constructor(public jsonitem: any)
    {
        super();
        // For now, deal with the JSON here as long as we pass JSON.
        console.log("parsing outside if");
        if(jsonitem!=null) // this constructor also gets called by other components passing on 'null', DateComponent apperantly does this.
        {
            this.parseBitstreams();
            this.parseMetadata();
            this.parseCollection();
        }
    }

    private parseBitstreams()
    {
        for(let i = 0; i < this.jsonitem.bitstreams.length;i++)
        {
            let bitstreamdata = this.jsonitem.bitstreams[i];
            //todo: refactor this?
            let bitstream = new Bitstream(null,bitstreamdata.id,bitstreamdata.name,bitstreamdata.retrieveLink,bitstreamdata.format,bitstreamdata.sizeBytes);
            this.bitstreams.push(bitstream);
        }
    }

    private parseMetadata()
    {
        for(let i = 0; i < this.jsonitem.metadata.length;i++)
        {
            let tempmetadata = new Metadatum(this,this.jsonitem.metadata[i]);
            this.metadata.push(tempmetadata);
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