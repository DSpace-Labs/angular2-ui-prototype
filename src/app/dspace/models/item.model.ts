import {DSpaceObject} from "./dspaceobject.model";
import {Bitstream}from './bitstream.model';
import {Metadatum}from './metadatum.model';
import {Collection}from './collection.model';


/**
 * A model class for an Item
 * Item has bitstreams, metadatum, collections..
 */
export class Item extends DSpaceObject {


    // Some classes create the ITEM from an incomplete JSON response. Need to filter for this.

    bitstreams : Bitstream[] = [];
    parentCollection : Collection;

    constructor(public jsonitem: any)
    {
        super(jsonitem);
        this.parseBitstreams();
        this.parseCollection();
    }

    private parseBitstreams()
    {
        if (Array.isArray(this.jsonitem.bitstreams))
        {
            for (let i = 0; i < this.jsonitem.bitstreams.length; i++)
            {
                let bitstreamdata = this.jsonitem.bitstreams[i];
                let bitstream = new Bitstream(bitstreamdata);
                this.bitstreams.push(bitstream);
            }
        }
    }

    private parseCollection()
    {
        this.parentCollection = new Collection(this.jsonitem.parentCollection);
    }


}