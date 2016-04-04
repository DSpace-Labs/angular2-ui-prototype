import {Injectable} from 'angular2/core';

/**
 * Injectable service to cache session context which have been visited.
 *
 * TODO: Create caching service which leverages local storage.
 */
@Injectable()
export class DSpaceStore {

    /**
     * A map of the visited items. Key, number, is the item id.
     *
     * TODO: replace Object with inheritance model. e.g. item extends dspaceObject
     */
    private items: Map<number, Object>;

    /**
     * A map of the visited collections. Key, number, is the collection id.
     * 
     * TODO: replace Object with inheritance model. e.g. collection extends dspaceObject
     */
    private collections: Map<number, Object>;

    /**
     * A map of the visited communities. Key, number, is the community id.
     * 
     * TODO: replace Object with inheritance model. e.g. community extends dspaceObject
     */
    private communities: Map<number, Object>;

    constructor() {
        this.items = new Map<number, Object>();
        this.collections = new Map<number, Object>();
        this.communities = new Map<number, Object>();
    }

    /**
     * Method to retrieve the context by id. Context being community, 
     * collection, or item.
     *
     * @param type
     *      string: communities, collections, items
     * @param id
     *      context id
     */
    get(type, id) {
        return this[type].get(id);
    }

    /**
     * Method to add context to store. 
     *
     * @param type
     *      string: communities, collections, items
     * @param context
     *      context: community, collection, or item
     */
    add(type, context) {
        this[type].set(context.id, context);
    }

    /**
     * Method to delete context by type and id. 
     *
     * @param type
     *      string: communities, collections, items
     * @param id
     *      context id
     */
    delete(type, id) {
        this[type].delete(id);
    }

    /**
     * Method to delete all stored context by type. 
     *
     * @param type
     *      string: communities, collections, items
     */
    deleteAll(type) {
        this[type] = new Map<number, Object>();
    }

}
