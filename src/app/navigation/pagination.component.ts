import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES, Route, RouteConfig, RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace/dspace.directory';
import {DSpaceStore} from '../dspace/dspace.store';
import {DSpaceKeys} from '../dspace/dspace.keys';

import {PaginationService} from './pagination.service';

/**
 * Pagination component for controlling paging among a given context. Currently, only items.
 */
@Component({
    selector: 'pagination',
    directives: [ROUTER_DIRECTIVES],
    template: `
                <div *ngIf="context.limit < context.total" class="form-inline">
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

                        <li *ngIf="context.page < context.pageCount">
                            <!-- Router Link -->
                            <a [routerLink]="['/' + context.component, {id: context.id, page: next}]">
                                <span aria-label="Next"><span aria-hidden="true"><span class="glyphicon glyphicon-forward"></span></span></span>
                            </a>
                        </li>
                        <li *ngIf="context.page == context.pageCount" class="disabled">
                            <span aria-label="Next"><span aria-hidden="true"><span class="glyphicon glyphicon-forward"></span></span></span>
                        </li>

                    </ul>

                    <select [(ngModel)]="context.limit" #option (change)="updateLimit(option)" class="form-control">
                        <option *ngFor="#o of limitOptions" [value]="o">{{ o }}</option>
                    </select>

                </div>
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
     * A number array that represents options for a context pagination limit.
     */
    limitOptions: Array<number>;
    
    /**
     * 
     * @param directory 
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param dspaceService 
     *      DSpaceService is a singleton service to interact with the dspace REST API.
     * @param dspaceStore 
     *      DSpaceStore is a singleton service to cache context which have already been requested.
     * @param dspaceKeys 
     *      DSpaceKeys is a singleton service with constants.
     * @param paginationService 
     *      PaginationService is a singleton service for pagination controls.
     */
    constructor(private dspaceDirectory: DSpaceDirectory,
                private dspaceStore: DSpaceStore,
                private dspaceKeys: DSpaceKeys,
                private paginationService: PaginationService) {
        this.limitOptions = paginationService.getLimitOptions();    
    }

     /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit() {        
        this.pages = Array(this.context.pageCount).fill(0).map((e,i)=>i+1);
        this.paginationService.updatePagesArray(this.pages, this.context.page);
        this.previous = +this.context.page - 1;
        this.next = +this.context.page + 1;
    }
    
    /**
     * Method to set the limit on the context and refresh pages and pagination controls.
     * 
     * @param option
     *          select option which holds current value selected.
     */
    updateLimit(option) {
        // when selecting a limit greater than the total the following exception is thrown
        // throws browser_adapter.js:76 EXCEPTION: Attempt to use a dehydrated detector: PaginationComponent_1 -> ngModelChange
        // this seems to be an issue with Angular2 and/or Angular Universal
        
        // TODO: figure out how to index caching pages of subcommunities and collections
        // TODO: find a better way to do this
        let subtypes = this.context.type == 'collection' ? 'items' : '';
        let subtype = this.context.type == 'collection' ? 'item' : '';
        
        this.dspaceStore.clearPages(subtypes, this.context.id);
        this.context.limit = option.value;
        this.context.pageCount = Math.ceil(this.context.total / this.context.limit);
        this.pages = Array(this.context.pageCount).fill(0).map((e,i)=>i+1);
        this.paginationService.updatePagesArray(this.pages, this.context.page);
        this.dspaceDirectory.loadNav(subtype, this.context);
    }

}
