import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { BreadcrumbService } from './navigation/services/breadcrumb.service';
import { DSpaceDirectory } from './dspace/dspace.directory';
import { PaginationComponent } from './navigation/components/pagination.component';
import { TreeComponent } from './navigation/components/tree.component';

/**
 * The dashboard component is the main index for browsing. Layout contains a 
 * sidebar context along with the community/collection/item tree.
 */
@Component({
    selector: "directory",
    pipes: [TranslatePipe],
    directives: [TreeComponent],
    template: `
                <tree [directories]="dspace.directory"></tree>
              `
})
export class DashboardComponent {

    /**
     *
     * @param dspace 
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param translate
     *      TranslateService
     */
    constructor(private dspace: DSpaceDirectory,
                private breadcrumbService: BreadcrumbService,
                private translate: TranslateService ) {
        breadcrumbService.visit({
            name: 'Dashboard',
            type: 'dashboard',
            component: '/Dashboard',
            root: true,
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}
