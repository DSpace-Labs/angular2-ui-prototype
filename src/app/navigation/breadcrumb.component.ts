import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {DSpaceDirectory} from '../dspace/dspace.directory';

import {BreadcrumbService} from './breadcrumb.service';

/**
 * 
 */
@Component({
    selector: 'breadcrumb',
    directives: [ROUTER_DIRECTIVES],
    template: `
    			<ul class="list-inline breadcrumb">
                    <li *ngFor="#breadcrumb of trail">
                        <a *ngIf="breadcrumb.component" [routerLink]="[breadcrumb.component, {id:breadcrumb.id}]">{{ breadcrumb.name }} {{ breadcrumb.id }}</a>
                        <a *ngIf="!breadcrumb.component" [routerLink]="['/Dashboard']">{{breadcrumb.name}}</a>
                    </li>
                </ul>
    		  `
})
export class BreadcrumbComponent {

    /**
     * 
     */
    trail: Array<Object>;

    /**
     * 
     */
    subscription: any;

    /**
     * 
     */
    constructor(private breadcrumbService: BreadcrumbService, private directory: DSpaceDirectory) { }

    /**
     * 
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
     * 
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
     * 
     */
    ngOnInit() {
        let breadcrumb = this.breadcrumbService.getBreadcrumb();
        if (breadcrumb)
            this.buildTrail(breadcrumb);
        else
            console.log('why no breadcrumb?');
    }

    /**
     * 
     */
    ngAfterViewInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(context => {
            this.buildTrail(context);
        });
    }

    /**
     * 
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}