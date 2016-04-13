import {Injectable} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

import {DSpaceService} from '../dspace/dspace.service';

/**
 * Injectable service to process breadcrumb when a context is visited.
 */
@Injectable()
export class BreadcrumbService {

    /**
     * EventEmitter use to emit the context when visited.
     * BreadCrumb component subscribes.
     */
    emitter: EventEmitter<any>;
    
    /**
     * A breadcrumb that is itself the current context.
     */
    breadcrumb: any;

    /**
     * @param dspaceService 
     *      DSpaceService is a singleton service to interact with the dspace REST API.
     */            
    constructor(private dspaceService: DSpaceService) {
        this.breadcrumb = {};
        this.emitter = new EventEmitter<any>();
    }

    /**
     * Method to emit context when it is visited.
     *
     * @param context
     *      Object that represents the current context. Community, Collection, or Item.
     */
    visit(context) {
        this.breadcrumb = context;
        this.emitter.next(this.breadcrumb);
    }
    
    /**
     * Method to return the current breadcrumb, context.
     *
     * @returns
     *      the current breadcrumb, which is the current context
     */
    getBreadcrumb() {
        return this.breadcrumb;
    }
    
}