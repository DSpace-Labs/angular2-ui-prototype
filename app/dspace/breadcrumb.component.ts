import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

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
    
    constructor() {

        this.trail = [
            { name: 'Dashboard', link: 'Dashboard' }
        ];

    }

    ngAfterViewInit() {
        console.log("Breadcrumb initialized.");
    }

}