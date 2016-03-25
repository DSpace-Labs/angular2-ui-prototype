import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Location, RouteConfig} from 'angular2/router';

import {DSpaceDirectory} from './dspace/dspace.directory';

import {TreeComponent} from './navigation/tree.component';
import {ContextComponent} from './navigation/context.component';

@Component({
    selector: "directory",
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
        type: string
    };

    constructor(private location: Location, private dspace: DSpaceDirectory) {
        this.dashboard = {
            name: 'Dashboard',
            type: 'dashboard'
        };
       
    }

    ngOnInit() {
        this.dspace.loadDirectory();
    }

}
