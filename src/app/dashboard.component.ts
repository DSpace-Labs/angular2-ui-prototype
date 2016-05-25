import { Component, OnDestroy } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from './dspace/authorization/services/authorization.service';

import { BreadcrumbService } from './navigation/services/breadcrumb.service';
import { DSpaceHierarchyService } from './dspace/services/dspace-hierarchy.service';

import { TreeComponent } from './navigation/components/tree.component';

import { SidebarService } from './utilities/services/sidebar.service';

import { DashboardSidebarHelper } from './utilities/dashboard-sidebar.helper';


import { Breadcrumb } from './navigation/models/breadcrumb.model';

/**
 * The dashboard component is the main index for browsing. Layout contains a
 * sidebar context along with the community/collection/item tree.
 */
@Component({
    selector: "hierarchy",
    pipes: [ TranslatePipe ],
    directives: [ TreeComponent ],
    template: `
                <tree [hierarchies]="dspace.hierarchy"></tree>
              `
})
export class DashboardComponent implements OnDestroy {


    /**
     *
     * @type {Breadcrumb}
     */
    private breadcrumb: Breadcrumb = new Breadcrumb('dashboard', true);


    /**
     *
     */
    sidebarHelper : DashboardSidebarHelper;

    /**
     *
     * @param dspace 
     *      DSpaceHierarchyService is a singleton service to interact with the dspace directory.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param sidebarService
     *      SidebarService is a singleton service to interact with the sidebar component
     * @param authorization
     *      AuthorizatinoService is a singleton service to deal with user authorization.
     */
    constructor(private dspace: DSpaceHierarchyService,
                private breadcrumbService: BreadcrumbService,
                private sidebarService : SidebarService,
                private authorization : AuthorizationService) {
        breadcrumbService.visit(this.breadcrumb);

        this.sidebarHelper = new DashboardSidebarHelper(sidebarService, authorization);
        this.sidebarHelper.populateSidebar();

    }

    ngOnDestroy()
    {
        this.sidebarHelper.removeSections();
    }

}
