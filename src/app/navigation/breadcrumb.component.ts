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
                        <a *ngIf="breadcrumb.component" [routerLink]="[breadcrumb.component, {id:breadcrumb.id}]">{{ breadcrumb.name }}</a>
                        <a *ngIf="!breadcrumb.component" [routerLink]="['/Dashboard']">{{breadcrumb.name}}</a>
                    </li>
                </ul>
    		  `
})
export class BreadcrumbComponent {

    /**
     * Array of Objects, { name: string, context: Object }, representing the 
     * breadcrumb trail.
     */
    trail: Array<Object>;

    /**
     * Subscription to the breadcrumb service to recieve changes to the breadcrumb trail.
     */
    subscription: any;

    /**
     *
     * @param directory 
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     */
    constructor(private directory: DSpaceDirectory, 
                private breadcrumbService: BreadcrumbService) {}

    /**
     * Method to build the breadcrumb trail when a given context is visited.
     * 
     * @param context
     *      The current context. Represents a dspace object community, collection, or item.
     */
    buildTrail(context) {
        this.trail = new Array<Object>();
        if (Object.keys(context).length > 0 && context.name != 'Dashboard') {
            this.dropBreadcrumb(context).then(() => {
                this.trail.unshift({ name: 'Dashboard', context: {} });
            });
        }
        else {
            this.trail.unshift({ name: 'Dashboard', context: {} });
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
                context: context
            });            
            if (context.parentCommunity || context.parentCollection) {
                let parentType;
                if(context.parentCommunity)
                    parentType = 'Community';
                else 
                    parentType = 'Collection';
                if (context['parent' + parentType].ready) {
                    bc.dropBreadcrumb(context['parent' + parentType]).then(() => {
                        resolve();
                    });
                }
                else {
                    bc.directory.loadObj(context['parent' + parentType].type, context['parent' + parentType].id).then(obj => {
                        context['parent' + parentType] = obj;
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
        let breadcrumb = this.breadcrumbService.getBreadcrumb();
        if (breadcrumb)
            this.buildTrail(breadcrumb);
        else
            console.log('why no breadcrumb?');
    }

    /**
     * Method provided by Angular2. Invoked after the component view is ready.
     */
    ngAfterViewInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(context => {
            this.buildTrail(context);
        });
    }

    /**
     * Method provided by Angular2. Invoked when destroying the component.
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}