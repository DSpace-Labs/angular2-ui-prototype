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

                        <li *ngFor="#i of pages" [ngClass]="{active: i == context.page}" [class.disabled]="i == '...'">
                            <!-- Router Link -->
                            <a [routerLink]="['/' + context.component, {id: context.id, page: i}]" *ngIf="i != '...'">{{ i }}</a>
                            <span *ngIf="i == '...'">{{ i }}</span>
                        </li>

                        <li *ngIf="context.page < pageCount">
                            <!-- Router Link -->
                            <a [routerLink]="['/' + context.component, {id: context.id, page: next}]">
                                <span aria-label="Next"><span aria-hidden="true"><span class="glyphicon glyphicon-forward"></span></span></span>
                            </a>
                        </li>
                        <li *ngIf="context.page == pageCount" class="disabled">
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
    pages: Array<any>;
    
    /**
     * A number that represents the previous page.
     */
    previous: number;
    
    /**
     * A number that represents the next page.
     */
    next: number;
    
    /**
     * A number that represents the number of pages.
     */
    pageCount: number;

     /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit() {        
        this.pages = Array(this.context.pageCount).fill(0).map((e,i)=>i+1);
        
        this.pageCount = this.pages.length;
        
        if (this.pages.length > 10) {
            let diff = this.pages.length - 10;
                        
            if (this.context.page <= 9) {
                this.pages.splice(9, diff);
                this.pages.splice(9, 0, '...');
            }
            else if (this.context.page > diff + 2) {
                this.pages.splice(1, diff);
                this.pages.splice(1, 0, '...');
            }
            else {
                let innerPages = new Array<any>();
                innerPages.push(+this.context.page - 3);
                innerPages.push(+this.context.page - 2);
                innerPages.push(+this.context.page - 1);
                innerPages.push(this.context.page);
                innerPages.push(+this.context.page + 1);
                innerPages.push(+this.context.page + 2);
                innerPages.push(+this.context.page + 3);
                this.pages = new Array<any>();
                this.pages.push(1);
                this.pages.push('...');
                this.pages = this.pages.concat(innerPages);
                this.pages.push('...');
                this.pages.push(this.pageCount);
            }

        }
        
        this.previous = +this.context.page - 1;
        this.next = +this.context.page + 1;
    }

}
