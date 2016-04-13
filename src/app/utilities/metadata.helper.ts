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
        return metadata; // return unfiltered
    }
}