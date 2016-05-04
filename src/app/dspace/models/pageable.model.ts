import {IPaging} from "../interfaces/paging.interface";
import {ObjectUtil} from "../../utilities/commons/object.util";

/**
 * 
 */
export abstract class Pageable implements IPaging {

    ready: boolean; // indicates object ready

    loaded: boolean; // indicates navigation loaded

    offset: number;

    page: number;

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

    sanatize(): void {
        this.ready = undefined;
        this.loaded = undefined;
        this.offset = undefined;
        this.page = undefined;
        this.limit = undefined;
        this.component = undefined;
        this.pageCount = undefined;
        this.total = undefined;
    }

}