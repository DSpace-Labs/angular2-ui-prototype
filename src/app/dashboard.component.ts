import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from './dspace/dspace.directory';

import {TreeComponent} from './navigation/tree.component';
import {ContextComponent} from './navigation/context.component';
import {BreadcrumbService} from './navigation/breadcrumb.service';
import {PaginationComponent} from './navigation/pagination.component';


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
    directives: [TreeComponent, ContextComponent, ItemListComponent],
    template: `
                <div class="container">
                    <div class="col-md-4">
                        <context [context]="dashboard"></context>
                    </div>
                    <div class="col-md-8">
                        <tree [directories]="dspace.directory | async"></tree>
                    </div>

                       <h3>Testing item list</h3>
                      <item-list [items]="items"></item-list>


                </div>


              `
})
export class DashboardComponent {

    /**
     * Object to resemble the dashboard breadcrumb.
     */
    private dashboard: {
        name: string,
        type: string
    };

    items : Item[];

    /**
     *
     * @param dspace 
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     */
    constructor(private dspace: DSpaceDirectory,
                private breadcrumb: BreadcrumbService,
                translate: TranslateService ){

        this.dashboard = {
            name: 'Dashboard',
            type: 'dashboard'
        };
        
        breadcrumb.visit(this.dashboard);

        this.dspace.loadDirectory();
        this.dspace.loadRecentItems('recentitems',0).then( json =>
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
        console.log("in dashboard init");

    }

}
