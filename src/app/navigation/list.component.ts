import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

/**
 * List component for navigation of the items of a collection.
 *
 * TODO: implement pagination of items
 */
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

    /**
     * An input variable that is passed into the component [items].
     * Represents the current collections items. Currently, only the
     * first 100 items of the collection. 
     * 
     * The dspace service will have to be adjusted when requesting items
     * from the API using limit and offset query parameters.
     */
 	@Input() items: Array<Object>;

}