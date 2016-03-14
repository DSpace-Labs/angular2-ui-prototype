import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'breadcrumb'
})
@View({
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES],
    template: ` 
                <ul class="list-inline breadcrumb">
                    <li *ngFor="#page of trail">
                        <a [routerLink]="[ '/' + page.link ]">{{page.name}}</a>
                    </li>
                </ul>
              `
})
export class BreadcrumbComponent {

    trail: Object;
    
    subscription: any;
    
    constructor(private breadcrumbService: BreadcrumbService) {

        this.trail = [
            { name: 'Dashboard', link: 'Dashboard' }
        ];

        this.buildTrail(this.breadcrumbService.getBreadcrumb());
                
    }

    buildTrail(context) {
        console.log(context);
        console.log('build trail');
    }

    ngOnInit() {
        console.log('subscribing');
        this.subscription = this.breadcrumbService.emitter.subscribe(context => {
            this.buildTrail(context);
        });
    }

    ngOnDestroy() {
        console.log('unsubscribing');
        this.subscription.unsubscribe();
    }

}