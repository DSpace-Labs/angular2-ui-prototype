import {Injectable} from 'angular2/core';

import {DSpaceConstants} from '../dspace.constants';

/**
 * Injectable service to cache session context which have been visited.
 *
 * TODO: Create caching service which leverages local storage.
 */
@Injectable()
export class PagingStoreService {
    
    /**
     * A map of the visited items pages.
     */
    private itemsPages: Map<number, any>;
    
    /**
     * A map of the visited aggregated communities and collections pages.
     */
    private comcolsPages: Map<number, any>;
    
    constructor(private dspaceConstants: DSpaceConstants) {
        this.itemsPages = new Map<number, any>();
        this.comcolsPages = new Map<number, any>();
    }

    /**
     * Method to retrieve context page by id and page.
     *
     * @param context
     *      context: community, collection, or item
     */
    getPage(context): any {
        let pages = this[this.dspaceConstants[context.type].SUBTYPES + 'Pages'].get(context.id);
        if(!pages) {
            return null;
        }
        return pages.get(context.page);
    }

    /**
     * Method to add context page to the store. 
     *
     * @param context
     *      context: community, collection, or item
     */
    addPage(context): void {
        let subtypes = this.dspaceConstants[context.type].SUBTYPES;
        let pages = this[subtypes + 'Pages'].get(context.id);
        if(!pages) {
            this[subtypes + 'Pages'].set(context.id, new Map<number, any>());
            pages = this[subtypes + 'Pages'].get(context.id);
        }
        pages.set(context.page, context.type == 'collection' ? context.items : context.subcommunities.concat(context.collections));
    }

     /**
     * Method to clear pages by type and id. 
     *
     * @param context
     *      context: community, collection, or item
     */
    clearPages(context): void {
        this[this.dspaceConstants[context.type].SUBTYPES + 'Pages'].set(context.id, new Map<number, any>());
    }

}
