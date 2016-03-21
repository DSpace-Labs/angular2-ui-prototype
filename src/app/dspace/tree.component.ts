import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {ListComponent} from './list.component';

import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'tree',
    directives: [ROUTER_DIRECTIVES, TreeComponent, ListComponent],
    template: `
    			<ul class="list-group">
                    <li *ngFor="#directory of directories" class="list-group-item">
                        
                        <!-- Router link -->
                        <a (click)="select(directory)" class="clickable">{{ directory.name }}</a>
                        
                        <span *ngIf="directory.type == 'community'" class="badge">{{ directory.countItems }}</span>
                        
                        <span *ngIf="directory.type == 'collection'" class="badge">{{ directory.numberItems }}</span>
                        
                    </li>
                </ul>
    		  `
})
export class TreeComponent {

	@Input() directories: Array<Object>;

    constructor(private breadcrumbService: BreadcrumbService) {
        
    }

    select(directory) {
        this.breadcrumbService.visit(directory);
    }

}