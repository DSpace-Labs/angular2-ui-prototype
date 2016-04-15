import {Injectable} from 'angular2/core';

import * as preboot from 'preboot';

/**
 * Injectable service to provide pagination controls array.
 */
@Injectable()
export class PaginationService {

    /**
     * A boolean that represents whether or not the app has been bootstrapped.
     */
    private bootstrapped: boolean;

    /**
     * A number that represents the default number of 'items' in a page.
     */
    private defaultLimit: number;

    /**
     * A number array that represents options for a context pagination limit.
     */
    private limitOptions: Array<number>;

    constructor() {
        this.bootstrapped = preboot['complete'] ? true : false;
        this.defaultLimit = 10;
        this.limitOptions = [5, 10, 20, 50, 100];
    }
    
    // TODO: make less hardcoded, i.e. adjustable    
    createPagesArray(context) {
        let pages:Array<any> = Array(context.pageCount).fill(0).map((e,i)=>i+1);
        if(this.bootstrapped) {
            if (context.pageCount > 10) {
                let diff = context.pageCount - 10;
                            
                if (context.page <= 8) {
                    pages.splice(9, diff);
                    pages.splice(9, 0, '...');
                }
                else if (context.page > diff + 2) {
                    pages.splice(1, diff);
                    pages.splice(1, 0, '...');
                }
                else {
                    console.log(context);
                    pages.splice(0, context.pageCount);
                    pages.push(1);
                    pages.push('...');
                    pages.push(+context.page - 3);
                    pages.push(+context.page - 2);
                    pages.push(+context.page - 1);
                    pages.push(context.page);
                    pages.push(+context.page + 1);
                    pages.push(+context.page + 2);
                    pages.push(+context.page + 3);
                    pages.push('...');
                    pages.push(context.pageCount);
                }
            }
        }
        return pages;
    }
    
    getDefaultLimit() {
        return this.defaultLimit;    
    }
    
    setDefaultLimit(defaultLimit) {
        this.defaultLimit = defaultLimit;
    }
    
    getLimitOptions() {
        return this.limitOptions;
    }
    
    setLimitOptions(limitOptions) {
        this.limitOptions = limitOptions;
    }
    
}