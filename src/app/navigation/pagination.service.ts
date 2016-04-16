import {Injectable} from 'angular2/core';

/**
 * Injectable service to provide pagination controls array.
 */
@Injectable()
export class PaginationService {

    /**
     * A number that represents the default number of 'items' in a page.
     */
    private defaultLimit: number;

    /**
     * A number array that represents options for a context pagination limit.
     */
    private limitOptions: Array<number>;

    constructor() {
        this.defaultLimit = 10;
        this.limitOptions = [5, 10, 20, 50, 100];
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