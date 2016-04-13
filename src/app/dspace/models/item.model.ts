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
            this.parseBitstreams();
            this.parseCollection();
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


}