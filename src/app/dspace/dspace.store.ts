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
     * TODO: replace any with inheritance model. e.g. item extends dspaceObject
     */
    private items: Map<number, any>;
    
    /**
     * A map of the visited collections. Key, number, is the collection id.
     * 
     * TODO: replace any with inheritance model. e.g. collection extends dspaceObject
     */
    private collections: Map<number, any>;

    /**
     * A map of the visited communities. Key, number, is the community id.
     * 
     * TODO: replace any with inheritance model. e.g. community extends dspaceObject
     */
    private communities: Map<number, any>;
    
    /**
     * A map of the visited items pages.
     */ 
    private itemsPages: Map<number, any>;
    
    /**
     * A map of the visited collections pages.
     * 
     * TODO: collection and community pages are combined and should be here
     */
    private collectionsPages: Map<number, any>;
    
    /**
     * A map of the visited communities pages.
     * 
     * TODO: collection and community pages are combined and should be here
     */
    private communitiesPages: Map<number, any>;

    constructor() {
        this.items = new Map<number, any>();
        this.collections = new Map<number, any>();
        this.communities = new Map<number, any>();
        this.itemsPages = new Map<number, any>();
        this.collectionsPages = new Map<number, any>();
        this.communitiesPages = new Map<number, any>();
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
     * Method to retrieve context page by id and page.
     *
     * @param type
     *      string: communities, collections, items
     * @param id
     *      context id
     * @param page
     *      context page
     */
    getPage(type, id, page) {
        let pages = this[type + 'Pages'].get(id);
        if(!pages) return null;
        return pages.get(page);
    }

    /**
     * Method to add context to the store. 
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
     * Method to add context page to the store. 
     *
     * @param type
     *      string: communities, collections, items
     * @param context
     *      context: community, collection, or item
     */
    addPage(type, context) {
        let pages = this[type + 'Pages'].get(context.id);
        if(!pages) {
            this[type + 'Pages'].set(context.id, new Map<number, any>());
            pages = this[type + 'Pages'].get(context.id);
        }
        pages.set(context.page, context.type == 'collection' ? context.items : context.subcommunities.concat(context.collections));
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
        this[type] = new Map<number, any>();
    }
    
     /**
     * Method to clear pages by type and id. 
     *
     * @param type
     *      string: communities, collections, items
     * @param id
     *      context id
     */
    clearPages(type, id) {
        this[type + 'Pages'].set(id, new Map<number, any>());
    }

}
