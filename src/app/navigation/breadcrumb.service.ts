import {Injectable} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

import {DSpaceService} from '../dspace/dspace.service';

/**
 * 
 */
@Injectable()
export class BreadcrumbService {

    /**
     * 
     */
    emitter: EventEmitter<Object>;
    
    /**
     * 
     */
    breadcrumb: any;

    /**
     * 
     */            
    constructor(private dspaceService: DSpaceService) {
        this.breadcrumb = {};
        this.emitter = new EventEmitter<Object>();
    }

    /**
     * 
     */
    visit(context) {
        this.breadcrumb = context;
        this.emitter.next(this.breadcrumb);
    }
    
    /**
     * 
     */
    getBreadcrumb() {
        return this.breadcrumb;
    }
    
}