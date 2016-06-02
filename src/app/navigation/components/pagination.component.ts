import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';

import { BreadcrumbService } from '../services/breadcrumb.service';
import { DSpaceHierarchyService } from '../../dspace/services/dspace-hierarchy.service';
import { PagingStoreService } from '../../dspace/services/paging-store.service';
import { PaginationService } from '../services/pagination.service';

/**
 * Pagination component for controlling paging among a given context. Currently, only items.
 */
@Component({
    selector: 'pagination',
    directives: [ ROUTER_DIRECTIVES ],
    template: `
                <div *ngIf="context.limit < context.total" class="form-inline">
                    <nav>
                        <ul class="pager">
                            <li class="previous" [class.disabled]="firstPage()">
                                <!-- Router Link -->
                                <a *ngIf="!firstPage()" [routerLink]="[component, {id: context.id, page: previous, limit: context.limit}]" (click)="page(context.id, previous)">
                                    <span aria-label="Previous"><span aria-hidden="true"><span class="ion-icon ion-ios-arrow-back"></span> Previous</span></span>
                                </a>
                                <span *ngIf="firstPage()" aria-label="Previous"><span aria-hidden="true"><span class="ion-icon ion-ios-arrow-back"></span> Previous</span></span>
                            </li>
                            <li class="next" [class.disabled]="lastPage()">
                                <!-- Router Link -->
                                <a *ngIf="!lastPage()" [routerLink]="[component, {id: context.id, page: next, limit: context.limit}]" (click)="page(context.id, next)">
                                    <span aria-label="Next"><span aria-hidden="true">Next <span class="ion-icon ion-ios-arrow-forward"></span></span></span>
                                </a>
                                <span *ngIf="lastPage()" aria-label="Next"><span aria-hidden="true">Next <span class="ion-icon ion-ios-arrow-forward"></span></span></span>
                            </li>
                        </ul>
                    </nav>
                </div>
              `
})
export class PaginationComponent implements OnInit {

    /**
     * An input variable that is passed into the component [context].
     * Represents the current context.
     */
    @Input() private context: any;

    /**
     * A String that represents the current component.
     */
    private component: string;

    /**
     * A number that represents the previous page.
     */
    private previous: number;

    /**
     * A number that represents the next page.
     */
    private next: number;

     /**
     * A number array that represents options for a context pagination limit.
     */
    private limitOptions: Array<number>;

    /**
     *
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param pagingStore
     *      PagingStoreService is a singleton service to cache context which have already been requested.
     * @param paginationService
     *      PaginationService is a singleton service for pagination controls.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(private dspace: DSpaceHierarchyService,
                private pagingStore: PagingStoreService,
                private paginationService: PaginationService,
                private breadcrumbService: BreadcrumbService,
                private router: Router) {
        this.limitOptions = paginationService.getLimitOptions();
    }

     /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit() {
        // TODO: figure out a better way to do this
        if(this.router.hostComponent.name == "HomeComponent" || this.router.hostComponent.name == "CommunityComponent") {
            this.component = "/"
        }
        else {
            this.component = this.context.component;
        }
        this.next = +this.context.page + 1;
        this.previous = +this.context.page - 1;
    }

    /**
     * Method to page. Does not navigate, only requests next page.
     *
     * @param page
     *          The page being navigated to.
     */
    private page(id, page): void {
        this.context.unload();
        this.breadcrumbService.update({
            name:  this.context.name,
            component:  this.context.component,
            id:  this.context.id,
            page:  this.context.page
        })
        // only page here if on homepage or community component and paging this context id
        if(this.component == "/" && this.context.id == id) {
            this.context.page = page;
            this.context.offset = this.context.page > 1 ? (this.context.page - 1) * this.context.limit : 0;
            this.next = +this.context.page + 1;
            this.previous = +this.context.page - 1;
            this.loadContextNav();
        }
    }

    /**
     * Method to set the limit on the context and refresh pages and pagination controls.
     *
     * @param option
     *          Select option which holds current value selected.
     */
    private updateLimit(limit): void {
        let previousPage = this.context.page;
        this.pagingStore.clearPages(this.context);
        this.context.unload();
        this.context.page = this.context.page > 1 ? Math.ceil(((this.context.page - 1) * this.context.limit) / limit) : 1;
        this.context.limit = limit;
        this.context.pageCount = Math.ceil(this.context.total / this.context.limit);
        this.context.offset = this.context.page > 1 ? (this.context.page - 1) * this.context.limit : 0;
        this.next = +this.context.page + 1;
        this.previous = +this.context.page - 1;
        this.loadContextNav();
    }

    /**
     * Method to request the navigation for the given context.
     */
    private loadContextNav(): void {
        if (this.context.type == 'item') {
            // possibly load metadata page
        }
        else if (this.context.type == 'collection') {
            this.dspace.loadNav('item', this.context);
        }
        else {
            this.dspace.loadNav('community', this.context);
            this.dspace.loadNav('collection', this.context);
        }
    }

    /**
     *
     */
    private firstPage(): boolean {
        return this.context.page == 1;
    }

    /**
     *
     */
    private lastPage(): boolean {
        return this.context.page == this.context.pageCount;
    }

}
