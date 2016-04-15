import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {DSpaceDirectory} from '../dspace/dspace.directory';
import {DSpaceStore} from '../dspace/dspace.store';

import {PaginationService} from './pagination.service';

/**
 * Pagination component for controlling paging among a given context. Currently, only items.
 */
@Component({
    selector: 'pagination',
    inputs: ['context'],
    directives: [ROUTER_DIRECTIVES],
    template: `
                <div *ngIf="context.limit < context.total" class="form-inline">
                    <ul class="pagination">

                        <li *ngIf="context.page > 1">
                            <!-- Router Link -->
                            <a [routerLink]="[component, {id: context.id, page: previous, limit: context.limit}]" (click)="page(context.id, previous)">
                                <span aria-label="Previous"><span aria-hidden="true"><span class="glyphicon glyphicon-backward"></span></span></span>                                
                            </a>
                        </li>
                        <li *ngIf="context.page == 1" class="disabled">
                            <span aria-label="Previous"><span aria-hidden="true"><span class="glyphicon glyphicon-backward"></span></span></span>
                        </li>

                        <li *ngFor="#i of pages" [ngClass]="{active: i == context.page}" [class.disabled]="i == '...'">
                            <!-- Router Link -->
                            <a [routerLink]="[component, {id: context.id, page: i, limit: context.limit}]" *ngIf="i != '...'" (click)="page(context.id, i)">{{ i }}</a>
                            <span *ngIf="i == '...'">{{ i }}</span>
                        </li>

                        <li *ngIf="context.page < context.pageCount">
                            <!-- Router Link -->
                            <a [routerLink]="[component, {id: context.id, page: next, limit: context.limit}]" (click)="page(context.id, next)">
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
    context: any;

    /**
     * A String that represents the current component.
     */
    component: String;

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
     * @param dspaceDirectory
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param dspaceStore
     *      DSpaceStore is a singleton service to cache context which have already been requested.
     * @param paginationService
     *      PaginationService is a singleton service for pagination controls.
     * @param router
     *      Router
     */
    constructor(private dspaceDirectory: DSpaceDirectory,
                private dspaceStore: DSpaceStore,
                private paginationService: PaginationService,
                private router: Router) {
        this.limitOptions = paginationService.getLimitOptions();    
    }

     /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit() {
        this.previous = +this.context.page - 1;
        this.next = +this.context.page + 1;
        this.pages = this.paginationService.createPagesArray(this.context);
        if(this.router.hostComponent.name == "DashboardComponent" || this.router.hostComponent.name == "CommunityComponent")
            this.component = "/"
        else 
            this.component = this.context.component;
    }

    /**
     * Method to page on the dashboard. Does not navigate, only requests next page.
     * 
     * @param page
     *          The page being navigated to.
     */
    page(id, page) {
        this.context.loaded = false;
        // only page here if on dashboard or community component and paging this context id
        if(this.component == "/" && this.context.id == id) {
            this.context.page = page;
            this.previous = +this.context.page - 1;
            this.next = +this.context.page + 1;
            this.pages = this.paginationService.createPagesArray(this.context);
            this.context.offset = this.context.page > 1 ? (this.context.page - 1) * this.context.limit : 0;
            this.loadContextNav();
        }
    }

    /**
     * Method to set the limit on the context and refresh pages and pagination controls.
     * 
     * @param option
     *          Select option which holds current value selected.
     */
    updateLimit(option) {
        let previousPage = this.context.page;
        this.dspaceStore.clearPages(this.context);
        this.context.loaded = false;
        this.context.page = this.context.page > 1 ? Math.ceil(((this.context.page - 1) * this.context.limit) / option.value) : 1;
        this.previous = +this.context.page - 1;
        this.next = +this.context.page + 1;
        this.context.limit = option.value;
        this.context.offset = this.context.page > 1 ? (this.context.page - 1) * this.context.limit : 0;
        this.context.pageCount = Math.ceil(this.context.total / this.context.limit);
        if(previousPage == this.context.page || this.component == "/") {
            this.pages = this.paginationService.createPagesArray(this.context);
            this.loadContextNav();
        }
        else {
            setTimeout(() => {
                this.router.navigate([this.component, {id: this.context.id, page: this.context.page}]);
            });
        }
    }

    /**
     * Method to request the navigation for the given context.
     */
    loadContextNav() {
        if (this.context.type == 'item') {
            // possibly load metadata page
        }
        else if (this.context.type == 'collection') {
            this.dspaceDirectory.loadNav('item', this.context);
        }
        else {
            this.dspaceDirectory.loadNav('community', this.context);
            this.dspaceDirectory.loadNav('collection', this.context);
        }
    }

}
