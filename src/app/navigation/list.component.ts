import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {PaginationComponent} from './pagination.component';

/**
 * List component for navigation of the items of a collection.
 */
@Component({
    selector: 'list',
    directives: [ROUTER_DIRECTIVES, PaginationComponent],
    template: `
    			<ul class="list-group">
                    <li *ngFor="#item of collection.items" class="list-group-item">
                        <!-- Router Link -->
                        <a [routerLink]="[item.component, {id:item.id}]">{{ item.name }}</a>
                    </li>
                    <pagination [context]="collection"></pagination>
                </ul>
    		  `
})
export class ListComponent {

    /**
     * An input variable that is passed into the component [collection].
     * Represents the current collection.
     * 
     * TODO: replace any with inheritance model e.g. item extends dspaceObject
     */
 	@Input() collection: any;

}