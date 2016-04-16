import {IPaging} from "./paging.interface";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";

/**
 * 
 */
export abstract class Pageable implements IPaging {
    
    ready: boolean; // indicates object ready
    
    loaded: boolean; // indicates navigation loaded

    component: string;

    pageCount: number;

    limit: number;

    offset: number;

    page: number;

    total: number;

    constructor(json?: any) {
        if (ObjectUtil.isNotEmpty(json)) {
            this.ready = json.ready;
            this.component = json.component;
            this.pageCount = json.pageCount;
            this.limit = json.limit;
            this.offset = json.offset;
            this.page = json.page;
            this.total = json.total;
        }
    }

}