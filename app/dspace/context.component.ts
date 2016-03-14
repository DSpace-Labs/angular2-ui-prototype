import {Component, Input, View} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    selector: 'context'
})
@View({
    template: `
                <div class="panel panel-default">
				  	<div class="panel-heading">
				    	<h3 class="panel-title">{{context.name}}</h3>
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'dashboard'">
				    	is the dashboard
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'community'">
				    	is a community
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'collection'">
				    	is a collection
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'item'">
				    	is an item
				  	</div>
				</div>
              `
})
export class ContextComponent {

    @Input() context: Object;

    constructor(private router: Router) { }

}