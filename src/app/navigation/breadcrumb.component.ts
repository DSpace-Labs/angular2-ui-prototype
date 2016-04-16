import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {DSpaceDirectory} from '../dspace/dspace.directory';

import {BreadcrumbService} from './breadcrumb.service';

/**
 * Breadcrumb component for displaying current set of breadcrumbs of the 
 * hierarchy to the given context. e.g. Dashboard / Community / Collection / Item
 */
@Component({
    selector: 'breadcrumb',
    directives: [ROUTER_DIRECTIVES],
    template: `
    			<ul class="list-inline breadcrumb">
                    <li *ngFor="#breadcrumb of trail">
                        <a *ngIf="breadcrumb.id && !breadcrumb.page" [routerLink]="[breadcrumb.component, { id: breadcrumb.id }]">{{ breadcrumb.name }}</a>
                        <a *ngIf="breadcrumb.id && breadcrumb.page" [routerLink]="[breadcrumb.component, { id: breadcrumb.id, page: breadcrumb.page }]">{{ breadcrumb.name }}</a>
                        <a *ngIf="!breadcrumb.id" [routerLink]="['/Dashboard']">{{breadcrumb.name}}</a>
                    </li>
                </ul>
    		  `
})
export class BreadcrumbComponent {

    // TODO: probably should have a breadcrumb object

    /**
     * Array of any, { name: string, context: Object }, representing the breadcrumb trail.
     */
    trail: Array<any>;

    /**
     * Subscription to the breadcrumb service to recieve changes to the breadcrumb trail.
     */
    subscription: any;

    /**
     *
     * @param dspace
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     */
    constructor(private dspace: DSpaceDirectory,
                private breadcrumbService: BreadcrumbService) {

    }

    /**
     * Method to build the breadcrumb trail when a given context is visited.
     * 
     * @param context
     *      The current context. Represents a dspace object community, collection, or item.
     */
    buildTrail(context) {
        this.trail = new Array<any>();
        if (Object.keys(context).length > 0 && context.name != 'Dashboard') {
            this.dropBreadcrumb(context).then(() => {
                this.trail.unshift({ name: 'Dashboard', component: '/Dashboard' });
            });
        }
        else {
            this.trail.unshift({ name: 'Dashboard', component: '/Dashboard' });
        }
    }

    updateBreadcrumb(updatedBreadcrumb) {
        for(let breadcrumb of this.trail) {
            if(breadcrumb.name = updatedBreadcrumb.name) {
                breadcrumb = updatedBreadcrumb;
            }
        }
    }

    /**
     * Recursive method called by buildTrail to construct a breadcrumb trail
     * from the original provided context to the top most parent context.
     *
     * @param context
     *      The current context. Represents a dspace object community, collection, or item.
     */
    dropBreadcrumb(context) {
        let bc = this;
        return new Promise(function (resolve, reject) { 
            bc.trail.unshift({
                name: context.name,
                component: context.component,
                id: context.id,
                page: context.page
            });            
            if (context.parentCommunity || context.parentCollection) {
                let parentType = context.parentCommunity ? 'Community' : 'Collection';
                if (context['parent' + parentType].ready) {
                    bc.dropBreadcrumb(context['parent' + parentType]).then(() => {
                        resolve();
                    });
                }
                else {
                    bc.dspace.loadObj(context['parent' + parentType].type, context['parent' + parentType].id, context['parent' + parentType].page).then(parent => {
                        context['parent' + parentType] = parent;
                        bc.dropBreadcrumb(context['parent' + parentType]).then(() => {
                            resolve();
                        });
                    });
                }
            }
            else
                resolve();
        });
    }

    /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit() {

    }

    /**
     * Method provided by Angular2. Invoked after the component view is ready.
     */
    ngAfterViewInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(obj => {
            if(obj.action == 'visit')
                this.buildTrail(obj.context);
            else
                this.updateBreadcrumb(obj.breadcrumb)
        });
    }

    /**
     * Method provided by Angular2. Invoked when destroying the component.
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}