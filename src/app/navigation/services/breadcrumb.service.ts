import {Injectable} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

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

    constructor() {
        this.emitter = new EventEmitter<any>();
    }

    /**
     * Method to emit context when it is visited.
     *
     * @param context
     *      Object that represents the current context. Community, Collection, or Item.
     */
    visit(context): void {
        this.emitter.next({action: 'visit', context: context});
    }
    
    /**
     * Method to emit breadcrumb when it is updated.
     *
     * @param breadcrumb
     *      Object that represents the breadcrumb being updated from paging.
     */
    update(breadcrumb): void {
        this.emitter.next({action: 'update', breadcrumb: breadcrumb});
    }

}