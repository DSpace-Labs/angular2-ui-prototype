import {Collection} from "./collection.model";
import {DSOContainer} from "./dso-container.model";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";

export class Community extends DSOContainer {
    collections: Collection[];
    subCommunities: Community[];

    constructor(json?: any) {
        super(json);

        if (ObjectUtil.isNotEmpty(json)) {
            if (Array.isArray(json.collections)) {
                this.collections = json.collections.map((collectionJSON) => {
                    return new Collection(collectionJSON);
                })

            }
            if (Array.isArray(json.subcommunities)) {
                this.subCommunities = json.subcommunities.map((subCommunityJSON) => {
                    return new Community(subCommunityJSON);
                })
            }
        }
    }
}