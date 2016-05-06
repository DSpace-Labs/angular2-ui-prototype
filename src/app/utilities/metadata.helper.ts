import { Injectable } from 'angular2/core';
import { Metadatum } from '../dspace/models/metadatum.model'

/**
* A class to deal with some metadata functionality
*/
@Injectable()
export class MetadataHelper {

    /**
     * Return a subset of the provided metadata based on a key.
     * @param metadata
     * @param keys
     */
    filterMetadata(metadata: Array<Metadatum>, keys: Array<String>): Array<Metadatum> {
        let filteredMetadata: Array<Metadatum> = new Array<Metadatum>();
        for(let metadatum of metadata) {
            if(keys.indexOf(metadatum.key) > -1) {
                filteredMetadata.push(metadatum);
            }
        }
        return filteredMetadata; // return filtered metadata
    }

}
