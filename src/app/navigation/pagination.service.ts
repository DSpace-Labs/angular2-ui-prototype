import {Injectable} from 'angular2/core';

import * as preboot from 'preboot';

/**
 * Injectable service to provide pagination controls array.
 */
@Injectable()
export class PaginationService {
    
    bootstrapped: boolean;
    
    constructor() {
        this.bootstrapped = preboot['complete'] ? true : false;
    }
    
    // TODO: make less hardcoded, i.e. adjustable    
    updatePagesArray(pages, page) {
        if(this.bootstrapped) {
            let pageCount = pages.length;
            if (pageCount > 10) {
                let diff = pageCount - 10;
                            
                if (page <= 8) {
                    pages.splice(9, diff);
                    pages.splice(9, 0, '...');
                }
                else if (page > diff + 2) {
                    pages.splice(1, diff);
                    pages.splice(1, 0, '...');
                }
                else {
                    pages.splice(0, pageCount);
                    pages.push(1);
                    pages.push('...');
                    pages.push(+page - 3);
                    pages.push(+page - 2);
                    pages.push(+page - 1);
                    pages.push(page);
                    pages.push(+page + 1);
                    pages.push(+page + 2);
                    pages.push(+page + 3);
                    pages.push('...');
                    pages.push(pageCount);
                }
            }
        }
    }
    
}