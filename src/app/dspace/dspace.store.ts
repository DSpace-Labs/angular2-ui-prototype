import {Injectable} from 'angular2/core';

/**
 * 
 */
@Injectable()
export class DSpaceStore {

    /**
     * 
     */
    private items: Map<number, Object>;

    /**
     * 
     */
    private collections: Map<number, Object>;

    /**
     * 
     */
    private communities: Map<number, Object>;

    /**
     * 
     */
    constructor() {
        this.items = new Map<number, Object>();
        this.collections = new Map<number, Object>();
        this.communities = new Map<number, Object>();
    }

    /**
     * 
     */
    get(type, id) {
        return this[type].get(id);
    }

    /**
     * 
     */
    add(type, obj) {
        this[type].set(obj.id, obj);
    }

    /**
     * 
     */
    delete(type, id) {
        this[type].delete(id);
    }

    /**
     * 
     */
    deleteAll(type) {
        this[type] = new Map<number, Object>();
    }

}
