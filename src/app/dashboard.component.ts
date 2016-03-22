import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {DSpaceDirectory} from './dspace/dspace.directory';

import {TreeComponent} from './navigation/tree.component';
import {ContextComponent} from './navigation/context.component';

import {CommunityComponent} from './dspace/components/community.component';
import {CollectionComponent} from './dspace/components/collection.component';
import {ItemComponent} from './dspace/components/item.component';

@Component({
    selector: "dashboard",
    directives: [TreeComponent, ContextComponent],
    template: `
                <div class="container">
                    <div class="col-md-4">
                        <context [context]="dashboard"></context>
                    </div>
                    <div class="col-md-8">
                        <tree [directories]="dspace.directory | async"></tree>
                    </div>
                </div>
              `
})
export class DashboardComponent {

    private dashboard: {
        name: string,
        path: string,
        type: string
    };

    constructor(private dspace: DSpaceDirectory) {
        this.dashboard = {
            name: 'Dashboard',
            path: '/Dashboard',
            type: 'dashboard'
        };
        dspace.loadDirectory();
    }

}
