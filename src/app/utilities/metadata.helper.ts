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
        let tmp : Metadatum[] = [];
        for(let i : number = 0; i < metadata.length; i++)
        {
            if(keys.indexOf(metadata[i].key) > -1)
            {
                  tmp.push(metadata[i]);
            }
        }
        return tmp; // return filtered metadata
    }
}