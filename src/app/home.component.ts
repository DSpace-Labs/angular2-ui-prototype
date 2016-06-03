import { Component, OnDestroy, Inject } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";


import { BreadcrumbService } from './navigation/services/breadcrumb.service';
import { DSpaceHierarchyService } from './dspace/services/dspace-hierarchy.service';

import { TreeComponent } from './navigation/components/tree.component';
import { NewsComponent } from './dspace/components/news.component';


import { HomeSidebarHelper } from './utilities/home-sidebar.helper';


import { Breadcrumb } from './navigation/models/breadcrumb.model';

/**
 * The home component is the main index for browsing. Layout contains a
 * sidebar context along with the community/collection/item tree.
 */
@Component({
    selector: "hierarchy",
    pipes: [ TranslatePipe ],
    directives: [ TreeComponent, NewsComponent ],
    providers : [ HomeSidebarHelper ],
    template: `
                <news class="home-news"></news>
                <!-- If a header i18n key is passed in, display it -->
                <h1 *ngIf="header">{{ header | translate }}</h1>
                <tree [header]="header" [hierarchies]="dspace.hierarchy"></tree>
              `
})
export class HomeComponent implements OnDestroy {

    /**
     * The header to be passed on to our tree.component
     * This is the i18n string as it occurs in the en.json file
     * @type {string}
     */
    private header: string = "home.hierarchy";

    /**
     *
     * @type {Breadcrumb}
     */
    private breadcrumb: Breadcrumb = new Breadcrumb('home', true);

    /**
     *
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace directory.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param sidebarHelper
     *      SidebarHelper is a helper-class to inject the sidebar sections when the user visits this component
     */
    constructor(private dspace: DSpaceHierarchyService,
                private breadcrumbService: BreadcrumbService,
                @Inject(HomeSidebarHelper) private sidebarHelper : HomeSidebarHelper) {
        breadcrumbService.visit(this.breadcrumb);
        this.sidebarHelper.populateSidebar();
    }

    /**
     *
     */
    ngOnDestroy() {
        this.sidebarHelper.removeSections();
    }

}
