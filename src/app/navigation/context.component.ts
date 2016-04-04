import {Component, Input} from 'angular2/core';

/**
 * 
 */
@Component({
    selector: 'context',
    template: `
    			<div class="panel panel-default">
				  	<div class="panel-heading">
				    	<h3 class="panel-title">{{context.name}}</h3>
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'dashboard'">
				    	{{context}}
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'community'">
				    	{{context}}
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'collection'">
				    	{{context}}
				  	</div>
				  	<div class="panel-body" *ngIf="context.type == 'item' && context.second">
                        <ul>
                            <li *ngFor="#bitstream of context.bitstreams">
                                <a (click)="select(bitstream)" class="clickable">{{bitstream.name}}</a>
                            </li>
                        </ul>
				  	</div>
				</div>
    		  `
})
export class ContextComponent {

    /**
     * 
     */
	@Input() context: Object;

    /**
     * 
     */
    select(object) {        
        switch (this.context['type']) {
            case 'community': { } break;
            case 'collection': { } break;
            case 'item': { } break;
            default: { } break;
        }
    }

}