import {DSOContainer} from "./dso-container.model";
import {Bitstream}from './bitstream.model';
import {Metadatum}from './metadatum.model';
import {Collection}from './collection.model';


/**
 * A model class for an Item
 * Item has bitstreams, metadatum, collections..
 */
export class Item extends DSOContainer {

    bitstreams : Array<Bitstream> = [];

    parentCollection : Collection;
    
    lastModified: string; //TODO: change to date, deserialize
    
    archived: boolean;
    
    withdrawn: boolean;
    
    fullItem: boolean;

    constructor(public json: any) {
        super(json); // Creates a DSpaceObject with some of the information about this item (name,id,..)
        this.parseBitstreams();
        this.parseCollection();
    }

    /**
     * Get the bitstreams for this item.
     * Store them in a bitstream array
     */
    private parseBitstreams() {
        if (Array.isArray(this.json.bitstreams)) {
            for (let bitstream of this.json.bitstreams) {
                this.bitstreams.push(new Bitstream(bitstream));
            }
        }
    }

    // Get the parent collection information for this item.
    private parseCollection() {
        this.parentCollection = new Collection(this.json.parentCollection,false);
    }


}