import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES, Route, RouteConfig, RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace/dspace.directory';

/**
 * Pagination component for controlling paging among a given context. Currently, only items.
 */
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

    /**
     * An input variable that is passed into the component [context].
     * Represents the current context.
     * 
     * TODO: replace any with inheritance model e.g. dspaceObject
     */
    @Input() context: any;

     /**
     * Array of numbers for templating over. [1,2,3,4] for 4 pages. 
     */
    pages: Array<number>;
    
    /**
     * A number that represents the previous page.
     */
    previous: number;
    
    /**
     * A number that represents the next page.
     */
    next: number;

     /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit() {        
        this.pages = Array(this.context.pageCount).fill(0).map((e,i)=>i+1);
        this.previous = +this.context.page - 1;
        this.next = +this.context.page + 1;
    }

}
