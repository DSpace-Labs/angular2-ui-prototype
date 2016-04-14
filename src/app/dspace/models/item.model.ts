import {DSpaceObject} from "./dspaceobject.model";
import {Bitstream}from './bitstream.model';
import {Metadatum}from './metadatum.model';
import {Collection}from './collection.model';


/**
 * A model class for an Item
 * Item has bitstreams, metadatum, collections..
 */
export class Item extends DSpaceObject {


    bitstreams : Bitstream[] = [];
    parentCollection : Collection;

    constructor(public jsonitem: any)
    {
        super(jsonitem); // Creates a DSpaceObject with some of the information about this item (name,id,..)
        this.parseBitstreams();
        this.parseCollection();
    }

    /**
     * Get the bitstreams for this item.
     * Store them in a bitstream array
     */
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

    // Get the parent collection information for this item.
    private parseCollection()
    {
        this.parentCollection = new Collection(this.jsonitem.parentCollection,false);
    }


}