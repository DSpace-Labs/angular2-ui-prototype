import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'list',
    directives: [ROUTER_DIRECTIVES],
    template: `
    			<ul class="list-group">
                    <li *ngFor="#item of items" class="list-group-item">
                        <!-- Router Link -->
                        <a (click)="select(item)" class="clickable">{{ item.name }}</a>
                    </li>
                </ul>
    		  `
})
export class ListComponent {

 	@Input() items: Array<Object>;

    constructor(private breadcrumbService: BreadcrumbService) { 
        
    }

    select(item) {
        this.breadcrumbService.visit(item);
    }

}