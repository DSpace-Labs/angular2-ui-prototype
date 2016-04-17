import {Collection} from "./collection.model";
import {DSOContainer} from "./dso-container.model";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";

/**
 * A model class for a Community.
 */
export class Community extends DSOContainer {

    /**
     * An array of the Collections in this Community.
     */
    collections: Array<Collection>;

    /**
     * An array of the sub-communities in this Community.
     */
    subcommunities: Array<Community>;

    /**
     * Parent community.
     */
    parentCommunity : Community;

    /**
     * Create a new Community
     *
     * @param json
     *      A plain old javascript object representing a Community as would be returned from the
     *      REST API. Currently only json.collections and json.subcommunities are used, apart from 
     *      the standard DSpaceObject properties
     */
    constructor(json?: any) {
        super(json);
        if (ObjectUtil.isNotEmpty(json)) {
            this.parentCommunity = json.parentCommunity;

            if (Array.isArray(json.collections)) {
                this.collections = json.collections.map((collectionJSON) => {
                    return new Collection(collectionJSON);
                });
            }

            if (Array.isArray(json.subcommunities)) {
                this.subcommunities = json.subcommunities.map((subCommunityJSON) => {
                    return new Community(subCommunityJSON);
                });
            }
        }
    }

}
