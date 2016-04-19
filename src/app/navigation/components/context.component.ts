import {Component} from 'angular2/core';

/**
 * Context aware component for displaying information/functionality of
 * the current context. Can be either a community, collection, or an item.
 */
@Component({
    selector: 'context',
    inputs: ['context'],
    template: `
    			<div class="panel panel-default">
				  	<div class="panel-heading">
				    	<h3 class="panel-title">{{context.name}}</h3>
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'dashboard'">
				    	<ul>
                            <li>{{context.type}}</li>
                        </ul>
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'community'">
				    	<ul>
                            <li>{{context.type}}</li>
                        </ul>
                        <div *ngIf="context.sidebarText" [innerHTML]="context.sidebarText"></div>
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'collection'">
				    	<ul>
                            <li>{{context.type}}</li>
                        </ul>
                        <div *ngIf="context.sidebarText" [innerHTML]="context.sidebarText"></div>
				  	</div>
				    <div class="panel-body" *ngIf="context.type == 'item'">

				  	</div>
				</div>
    		  `
})
export class ContextComponent {

    /**
     * An input variable that is passed into the component [context].
     * Represents the current context.
     */
	context: any;

}