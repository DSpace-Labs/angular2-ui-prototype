import { Injectable } from 'angular2/core';

import { DSpaceConstants } from '../dspace.constants';

/**
 * Injectable service to cache session context which have been visited.
 *
 * TODO: Create caching service which leverages local storage.
 */
@Injectable()
export class PagingStoreService {
    
    /**
     * A map of the visited item pages.
     */
    private itemPages: Map<number, any>;
    
    /**
     * A map of the visited collection pages.
     */
    private collectionPages: Map<number, any>;

    /**
     * A map of the visited community pages.
     */
    private communityPages: Map<number, any>;
    
    /**
     * 
     * @param dspaceConstants
     *      DSpaceConstants is a singleton service with constants.
     */
    constructor(private dspaceConstants: DSpaceConstants) {
        this.itemPages = new Map<number, any>();
        this.collectionPages = new Map<number, any>();
        this.communityPages = new Map<number, any>();
    }

    /**
     * Method to retrieve context page by id and page.
     *
     * @param type
     *      community, collection, or item
     * @param context
     *      context: community, collection, or item
     */
    getPage(type, context): any {
        let pages = this[type + 'Pages'].get(context.id);
        if(!pages) {
            return null;
        }
        return pages.get(context.page);
    }

    /**
     * Method to add context page to the store. 
     *
     * @param type
     *      community, collection, or item
     * @param context
     *      context: community, collection, or item
     */
    addPage(type, context): void {
        let pages = this[type + 'Pages'].get(context.id);
        if(!pages) {
            this[type + 'Pages'].set(context.id, new Map<number, any>());
            pages = this[type + 'Pages'].get(context.id);
        }
        pages.set(context.page, type == 'item' ? context.items : type == 'collection' ? context.collections : context.subcommunities);
    }

     /**
     * Method to clear pages by type and id. 
     *
     * @param context
     *      context: community, collection, or item
     */
    clearPages(context): void {
        if(context.type == 'community') {
            this.collectionPages.set(context.id, new Map<number, any>());
            this.communityPages.set(context.id, new Map<number, any>());
        }
        else {
            this.itemPages.set(context.id, new Map<number, any>());
        }
    }

}
