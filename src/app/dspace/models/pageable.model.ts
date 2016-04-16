import {IPaging} from "../interfaces/paging.interface";
import {ObjectUtil} from "../../utilities/commons/object.util.ts";

/**
 * 
 */
export abstract class Pageable implements IPaging {

    ready: boolean; // indicates object ready

    loaded: boolean; // indicates navigation loaded

    offset: number = 0;

    page: number = 1;

    limit: number;

    component: string;

    pageCount: number;

    total: number;

    constructor(json?: any) {
        if (ObjectUtil.isNotEmpty(json)) {
            this.ready = json.ready ? json.ready : false;
            this.loaded = json.loaded ? json.loaded : false;
            this.offset = json.offset ? json.offset : 0;
            this.page = json.page ? json.page : 1;
            this.limit = json.limit;
            this.component = json.component;
            this.pageCount = json.pageCount;
            this.total = json.total;
        }
    }

}