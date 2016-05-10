import {DSOContainer} from "./dso-container.model";
import {Bitstream}from './bitstream.model';
import {Metadatum}from './metadatum.model';
import {Collection}from './collection.model';
import {ObjectUtil} from "../../utilities/commons/object.util";
import {Subject} from 'rxjs/Subject';
import {ArrayUtil} from "../../utilities/commons/array.util";

/**
 * A model class for an Item. Item has bitstreams, metadata, collections...
 */
export class Item extends DSOContainer {

    /**
     *
     */
    bitstreams : Array<Bitstream> = new Array<Bitstream>();

    /**
     *
     */
    parentCollection : Collection;

    /**
     *
     */
    lastModified: string; //TODO: change to date, deserialize

    /**
     *
     */
    archived: boolean;

    /**
     *
     */
    withdrawn: boolean;

    /**
     *
     */
    fullItem: boolean;

    newMetadata : Subject<Boolean>;


    /**
     * Create a new DSpaceObject.
     *
     * @param json
     *      A plain old javascript object representing an Item as would be returned
     *      from the REST api. It uses json.parentCollection, json.lastModified, json.archived, 
     *      json.withdrawn, and json.bitstreams
     */
    constructor(json?: any) {
        super(json); // Creates a DSpaceObject with some of the information about this item (name,id,..)
        if (ObjectUtil.isNotEmpty(json)) {
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
        // create the observable
        this.newMetadata = new Subject<Boolean>();
    }

    /**
     * Adds a metadata element to the existing item.
     * Also generates an Rx event, so our components can be informed of this update.
     * Subject, Observable.
     * @param metadata
     */
    addMetadata(metadata? : Metadatum)
    {
        if(this.metadata == null)
        {
            this.metadata = new Array<Metadatum>();
        }
        let tempArray = this.metadata.slice(0);
        tempArray.push(metadata);
        this.metadata = tempArray;
    }

    /**
     *
     */
    getBitstreamsByBundleName(bundleName: string): Array<Bitstream> {
        return ArrayUtil.filterBy(this.bitstreams, 'bundleName', bundleName);
    }

    /**
     *
     */
    sanatize(): void {
        super.sanatize();
        this.fullItem = undefined;
    }

}
