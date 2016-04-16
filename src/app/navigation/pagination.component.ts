import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {DSpaceDirectory} from '../dspace/dspace.directory';
import {DSpaceStore} from '../dspace/dspace.store';
import {PaginationService} from './pagination.service';
import {BreadcrumbService} from './breadcrumb.service';

/**
 * Pagination component for controlling paging among a given context. Currently, only items.
 */
@Component({
    selector: 'pagination',
    inputs: ['context'],
    directives: [ROUTER_DIRECTIVES],
    template: `
                <div *ngIf="context.limit < context.total" class="form-inline">
                    <nav>
                        <ul class="pager">
                            <li class="previous" [class.disabled]="context.page == 1">
                                <!-- Router Link -->
                                <a [routerLink]="[component, {id: context.id, page: previous, limit: context.limit}]" (click)="page(context.id, previous)">
                                    <span aria-label="Previous"><span aria-hidden="true"><span class="glyphicon glyphicon-backward"></span> Previous</span></span>
                                </a>
                            </li>
                            <li class="next" [class.disabled]="context.page == context.pageCount">
                                <!-- Router Link -->
                                <a [routerLink]="[component, {id: context.id, page: next, limit: context.limit}]" (click)="page(context.id, next)">
                                    <span aria-label="Next"><span aria-hidden="true">Next <span class="glyphicon glyphicon-forward"></span></span></span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
              `
})
export class PaginationComponent {

    /**
     * An input variable that is passed into the component [context].
     * Represents the current context.
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
     * @param routeParams
     *      RouteParams
     */
    constructor(private dspaceDirectory: DSpaceDirectory,
                private dspaceStore: DSpaceStore,
                private paginationService: PaginationService,
                private breadcrumbService: BreadcrumbService,
                private router: Router) {
        this.limitOptions = paginationService.getLimitOptions();    
    }

     /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit() {
        if(this.router.hostComponent.name == "DashboardComponent" || this.router.hostComponent.name == "CommunityComponent")
            this.component = "/"
        else
            this.component = this.context.component;
        this.next = +this.context.page + 1;
        this.previous = +this.context.page - 1;
        this.pages = new Array(this.context.pageCount).fill(0).map((e,i)=>i+1);
    }

    /**
     * Method to page on the dashboard. Does not navigate, only requests next page.
     * 
     * @param page
     *          The page being navigated to.
     */
    page(id, page) {
        this.context.loaded = false;
        this.breadcrumbService.update({
            name:  this.context.name,
            component:  this.context.component,
            id:  this.context.id,
            page:  this.context.page
        })
        // only page here if on dashboard or community component and paging this context id
        if(this.component == "/" && this.context.id == id) {
            this.context.page = page;
            this.context.offset = this.context.page > 1 ? (this.context.page - 1) * this.context.limit : 0;
            this.next = +this.context.page + 1;
            this.previous = +this.context.page - 1;
            this.pages = new Array(this.context.pageCount).fill(0).map((e,i)=>i+1);
            this.loadContextNav();
        }
    }

    /**
     * Method to set the limit on the context and refresh pages and pagination controls.
     *
     * @param option
     *          Select option which holds current value selected.
     */
    updateLimit(limit) {
        let previousPage = this.context.page;
        this.dspaceStore.clearPages(this.context);
        this.context.loaded = false;
        this.context.page = this.context.page > 1 ? Math.ceil(((this.context.page - 1) * this.context.limit) / limit) : 1;
        this.context.limit = limit;
        this.context.pageCount = Math.ceil(this.context.total / this.context.limit);
        this.context.offset = this.context.page > 1 ? (this.context.page - 1) * this.context.limit : 0;
        this.next = +this.context.page + 1;
        this.previous = +this.context.page - 1;
        this.pages = new Array(this.context.pageCount).fill(0).map((e,i)=>i+1);
        this.loadContextNav();
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
