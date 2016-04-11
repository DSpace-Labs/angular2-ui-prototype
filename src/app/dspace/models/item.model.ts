import {DSpaceObject} from "./dspaceobject.model";


/**
 * A model class for an Item
 */
export class Item extends DSpaceObject {


    /**
     * Returns a map of key - value, of the metadata entries that match the keys in the incomming array.
     * @param keys
     * @param metadata
     */
    filterMetadata(keys : String[], metadata)
    {
        // partial data
        var jsonArr = {};
        var data = [];
        jsonArr.metadata = data;


        /* TEST DATA */
        // testing multiple authors.
        var testData = {
            "key" : "dc.contributor.author",
            "value" : "Ana"
        }
        // data.push(testData);
        /* END TEST DATA */

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