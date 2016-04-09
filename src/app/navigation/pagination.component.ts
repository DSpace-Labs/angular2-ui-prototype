import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES, Route, RouteConfig, Router, RouteParams} from 'angular2/router';

import {DSpaceService} from '../dspace/dspace.service';

@Component({
    selector: 'pagination',
    directives: [ROUTER_DIRECTIVES],
    template: `
                <nav *ngIf="pages.length > 1">
                    <ul class="pagination">

                        <li><span aria-label="Previous"><span aria-hidden="true">&laquo;</span></span></li>

                        <li *ngFor="#i of pages" [ngClass]="{active: i == page}">

                            <!-- Router Link -->
                            <a [routerLink]="['Pagination', {page: i}]">{{ i }}</a>

                        </li>

                        <li><span aria-label="Next"><span aria-hidden="true">&raquo;</span></span></li>

                    </ul>
                </nav>
              `
})
export class PaginationComponent {

    // TODO: switch to context
    @Input() context: any;

    pages: Array<number>;

    constructor(private dspaceService: DSpaceService,
                private router: Router,
                private params: RouteParams) {}

    ngOnInit() {
        console.log('init pagination')
        this.pages = Array(this.context.pageCount).fill(0).map((e,i)=>i+1);
        console.log("Page count: " + this.context.pageCount);
        console.log("Page limit: " + this.context.limit);
        console.log("Page offset: " + this.context.offset);
        console.log("Page: " + this.context.page);
        
        console.log("Pages: " + this.pages);
        
        console.log(this.router.hostComponent.name)
        console.log(this.params)

    }

}
