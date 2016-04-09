import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES, Route, RouteConfig, RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace/dspace.directory';

@Component({
    selector: 'pagination',
    directives: [ROUTER_DIRECTIVES],
    template: `
                <nav *ngIf="pages.length > 1">
                    <ul class="pagination">

                        <li *ngIf="context.page > 1">
                            <!-- Router Link -->
                            <a [routerLink]="['/' + context.component, {id: context.id, page: previous}]">
                                <span aria-label="Previous"><span aria-hidden="true"><span class="glyphicon glyphicon-backward"></span></span></span>                                
                            </a>
                        </li>
                        <li *ngIf="context.page == 1" class="disabled">
                            <span aria-label="Previous"><span aria-hidden="true"><span class="glyphicon glyphicon-backward"></span></span></span>
                        </li>

                        <li *ngFor="#i of pages" [ngClass]="{active: i == context.page}">
                            <!-- Router Link -->
                            <a [routerLink]="['/' + context.component, {id: context.id, page: i}]">{{ i }}</a>
                        </li>

                        <li *ngIf="context.page < pages.length">
                            <!-- Router Link -->
                            <a [routerLink]="['/' + context.component, {id: context.id, page: next}]">
                                <span aria-label="Next"><span aria-hidden="true"><span class="glyphicon glyphicon-forward"></span></span></span>
                            </a>
                        </li>
                        <li *ngIf="context.page == pages.length" class="disabled">
                            <span aria-label="Next"><span aria-hidden="true"><span class="glyphicon glyphicon-forward"></span></span></span>
                        </li>

                    </ul>
                </nav>
              `
})
export class PaginationComponent {

    @Input() context: any;

    pages: Array<number>;
    
    previous: number;
    next: number;

    ngOnInit() {        
        this.pages = Array(this.context.pageCount).fill(0).map((e,i)=>i+1);
        this.previous = +this.context.page - 1;
        this.next = +this.context.page + 1;
    }

}
