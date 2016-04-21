import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from './dspace/dspace.directory';

import {TreeComponent} from './navigation/components/tree.component';
import {ContextComponent} from './navigation/components/context.component';
import {PaginationComponent} from './navigation/components/pagination.component';
import {BreadcrumbService} from './navigation/services/breadcrumb.service';



import {ItemListComponent} from './dspace/components/item-list.component';

// Testing items hardcoded for now
import {Item} from './dspace/models/item.model'

/**
 * The dashboard component is the main index for browsing. Layout contains a 
 * sidebar context along with the community/collection/item tree.
 */
@Component({
    selector: "directory",
    pipes: [TranslatePipe],
    directives: [TreeComponent, ContextComponent],
    template: `
                <div class="container">
                    <div class="col-md-4">
                        <context [context]="dashboard"></context>
                    </div>
                    <div class="col-md-8">
                        <tree [directories]="dspace.directory"></tree>
                    </div>


                    <div class="col-md-12">
                        <h3>{{'dashboard.recent-submissions' | translate}}</h3>
                        <item-list [items]="items"></item-list>
                    </div>
                </div>


              `
})
export class DashboardComponent {

    /**
     * Object to resemble the dashboard breadcrumb.
     */
    private dashboard: {
        name: string,
        type: string,
        component: string
    };

    items : Item[];

    /**
     *
     * @param dspace 
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param translate
     *      TranslateService
     */
    constructor(private dspace: DSpaceDirectory,
                private breadcrumb: BreadcrumbService,
                translate: TranslateService ){

        this.dashboard = {
            name: 'Dashboard',
            type: 'dashboard',
            component: '/Dashboard'
        };
        breadcrumb.visit(this.dashboard);
        this.dspace.loadRecentItems('recentitems',"dashboard",0,5).then( json =>
        {
            // now we need to get the items out of this.
            this.items = [];
            for(let i : number = 0; i < json.length;i++)
            {
                let item : Item = new Item(json[i]);
                this.items.push(item);
            }
        });
        
        translate.setDefaultLang('en');
        translate.use('en');
    }

    /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit() {
        this.dspace.loadDirectory();
    }

}
