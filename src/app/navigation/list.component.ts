import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'list',
    directives: [ROUTER_DIRECTIVES],
    template: `
    			<ul class="list-group">
                    <li *ngFor="#item of items" class="list-group-item">
                        <!-- Router Link -->
                        <a [routerLink]="[item.component, {id:item.id}]">{{ item.name }}</a>
                    </li>
                </ul>
    		  `
})
export class ListComponent {

 	@Input() items: Array<Object>;

    constructor() { }

}