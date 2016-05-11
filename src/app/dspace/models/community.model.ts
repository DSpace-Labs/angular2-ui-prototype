import { Collection } from "./collection.model";
import { DSOContainer } from "./dso-container.model";
import { ObjectUtil } from "../../utilities/commons/object.util";

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
     * Number of items in community.
     */
    countItems: number;

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
            this.countItems = json.countItems;
            this.parentCommunity = new Community(json.parentCommunity);
            
            this.collections = new Array<Collection>();
            this.subcommunities = new Array<Community>();

            if (Array.isArray(json.collections) && json.collections.length > 0) {
                this.collections = json.collections.map((collectionJSON) => {
                    return new Collection(collectionJSON);
                });
            }

            if (Array.isArray(json.subcommunities) && json.subcommunities.length > 0) {
                this.subcommunities = json.subcommunities.map((subCommunityJSON) => {
                    return new Community(subCommunityJSON);
                });
            }
        }
    }

}
