import {Metadatum} from '../dspace/models/metadatum.model'

/**
 * A class to deal with some metadata functionality
 */
export class MetadataHelper
{

    constructor()
    {

    }

    /**
     * Return a subset of the provided metadata based on a key.
     * @param metadata
     * @param keys
     */
    filterMetadata(metadata : Metadatum[], keys : String[]) : Metadatum[]
    {
        console.log("filtering metadata now");
        let tmp : Metadatum[] = [];
        for(let i : number = 0; i < metadata.length; i++)
        {
            console.log("key of item: " + metadata[i].getKey());
            if(keys.indexOf(metadata[i].getKey()) > -1)
            {
                  tmp.push(metadata[i]);
            }
        }
        return tmp; // return filtered metadata
    }
}