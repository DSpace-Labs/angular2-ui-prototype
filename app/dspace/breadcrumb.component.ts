import {Component, View} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'breadcrumb'
})
@View({
    directives: [ROUTER_DIRECTIVES],
    template: ` 
                <ul class="list-inline breadcrumb">
                    <li *ngFor="#breadcrumb of trail">
                        <a [routerLink]="[breadcrumb.path, {id:breadcrumb.context.id}]" (click)="select(breadcrumb)" class="clickable">{{breadcrumb.name}}</a>
                    </li>
                </ul>
              `
})
export class BreadcrumbComponent {

    trail: Array<{}>;

    subscription: any;
            
    constructor(private breadcrumbService: BreadcrumbService) {
        this.buildTrail(this.breadcrumbService.getBreadcrumb());
    }

    buildTrail(context) {
        this.trail = new Array<{}>();
        this.dropBreadcrumb(context);
        this.trail.unshift({ name: 'Dashboard', path: '/Dashboard', context: {} });
    }

    select(breadcrumb) {
        this.breadcrumbService.visit(breadcrumb.context);
    }
        
    dropBreadcrumb(context) {
        if(context && context.name && context.link) {
            this.trail.unshift({ name: context.name, path: context.path, context: context });
            if (context.parentCommunity) {
                this.dropBreadcrumb(context.parentCommunity);
            }
            if (context.parentCollection) {
                this.dropBreadcrumb(context.parentCollection);
            }
        }
    }

    ngOnInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(context => {
            this.buildTrail(context);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}