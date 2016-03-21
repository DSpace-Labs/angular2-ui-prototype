import {Component} from 'angular2/core';

import {DSpaceService} from './dspace/dspace.service';

import {TreeComponent} from './dspace/tree.component';
import {ContextComponent} from './dspace/context.component';

@Component({
    selector: "dashboard",
    directives: [TreeComponent, ContextComponent],
    template: `
                <div class="container">                    
                    <div class="col-md-4">
                        <context [context]="dashboard"></context>
                    </div>
                    <div class="col-md-8">
                        <tree [directories]="dspaceService.directory | async"></tree>
                    </div>
                </div>
              `
})
export class DashboardComponent {

     dashboard = {
        name: 'Dashboard',
        path: '/Dashboard',
        type: 'dashboard'
    };

    constructor(private dspaceService: DSpaceService) {
        dspaceService.loadDirectory();
    }

}

