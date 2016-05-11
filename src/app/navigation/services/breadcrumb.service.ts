import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

import { ContextProviderService } from '../../dspace/services/context-provider.service';

/**
 * Injectable service to process breadcrumb when a context is visited.
 */
@Injectable()
export class BreadcrumbService {

    /**
     *
     */
    private root: {
        name: string,
        type: string,
        component: string
    }

    /**
     * EventEmitter use to emit the context when visited.
     * BreadCrumb component subscribes.
     */
    emitter: EventEmitter<any>;

    /**
     * 
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     */
    constructor(private contextProvider : ContextProviderService) {
        this.root = {
            name: 'Dashboard',
            type: 'dashboard',
            component: '/Dashboard'
        };
        this.emitter = new EventEmitter<any>();
    }

    /**
     * Method to emit context when it is visited.
     *
     * @param context
     *      Object that represents the current context. Community, Collection, or Item.
     */
    visit(context): void {
        if(context.root) {
            this.setRoot(context)
        }
        this.contextProvider.context = context;
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

    /**
     * 
     */
    getRoot(): any {
        return this.root;
    }

    /**
     * 
     */
    setRoot(root) {
        this.root = root;
    }

}