import { Paging } from "../interfaces/paging.interface";
import { ObjectUtil } from "../../utilities/commons/object.util";

/**
 *
 */
export abstract class Pageable implements Paging {

    /**
     * indicates object ready
     */
    ready: boolean;

    /**
     * indicating navigation for object subcommunities, collections, or items loaded
     */
    loaded: any;

    /**
     *
     */
    offset: number;

    /**
     *
     */
    page: number;

    /**
     *
     */
    limit: number;

    /**
     *
     */
    component: string;

    /**
     *
     */
    pageCount: number;

    /**
     *
     */
    total: number;

    /**
     * Create a new DSpaceObject.
     *
     * @param json
     *      A plain old javascript object representing an Pageable as would be returned
     *      from the hierarchy service. It uses json.ready, json.offset, json.page,
     *      json.limit, json.component, json.pageCount, and json.total
     */
    constructor(json?: any) {
        if (ObjectUtil.isNotEmpty(json)) {
            this.ready = json.ready ? json.ready : false;
            this.offset = json.offset ? json.offset : 0;
            this.page = json.page ? json.page : 1;
            this.limit = json.limit;
            this.component = json.component;
            this.pageCount = json.pageCount;
            this.total = json.total;
            this.unload();
        }
    }

    /**
     *
     */
    sanitize(): void {
        this.ready = undefined;
        this.loaded = undefined;
        this.offset = undefined;
        this.page = undefined;
        this.limit = undefined;
        this.component = undefined;
        this.pageCount = undefined;
        this.total = undefined;
    }

    /**
     *
     */
    unload(): void {
        this.loaded = {
            community: false,
            collection: false,
            item: false
        }
    }

}
