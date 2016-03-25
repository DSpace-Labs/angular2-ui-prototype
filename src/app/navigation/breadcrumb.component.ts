import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'breadcrumb',
    directives: [ROUTER_DIRECTIVES],
    template: `
    			<ul class="list-inline breadcrumb">
                    <li *ngFor="#breadcrumb of trail">
                        <a *ngIf="breadcrumb.component" [routerLink]="[breadcrumb.component, {id:breadcrumb.context.id}]" (click)="select(breadcrumb)" class="clickable">{{breadcrumb.name}}</a>                        
                        <a *ngIf="!breadcrumb.component" [routerLink]="['/Dashboard']" (click)="select(breadcrumb)" class="clickable">{{breadcrumb.name}}</a>
                    </li>
                </ul>
    		  `
})
export class BreadcrumbComponent {

    trail: Array<{}>;

    subscription: any;
            
    constructor(private breadcrumbService: BreadcrumbService) {

    }

    buildTrail(context) {
        this.trail = new Array<{}>();
        this.dropBreadcrumb(context);
        this.trail.unshift({ name: 'Dashboard', context: {} });
    }

    select(breadcrumb) {
        this.breadcrumbService.visit(breadcrumb.context);
    }
        
    dropBreadcrumb(context) {        
        if (context && context.name && context.link) {
            this.trail.unshift({
                name: context.name,
                path: context.path,
                component: context.component,
                context: context
            });
            if (context.parentCommunity) {
                this.dropBreadcrumb(context.parentCommunity);
            }
            if (context.parentCollection) {
                this.dropBreadcrumb(context.parentCollection);
            }
        }
    }

    ngOnInit() {
        let breadcrumb = this.breadcrumbService.getBreadcrumb();
        if (breadcrumb) {
            this.buildTrail(breadcrumb);
        }
        else {
            console.log('why no breadcrumb?');
        }
    }

    ngAfterViewInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(context => {
            console.log(context)
            this.buildTrail(context);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}