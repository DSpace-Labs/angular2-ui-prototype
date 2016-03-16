import {Component, View} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {DSpaceService} from './dspace/dspace.service';

import {TreeComponent} from './dspace/tree.component';
import {ContextComponent} from './dspace/context.component';
import {BreadcrumbComponent} from './dspace/breadcrumb.component';

@Component({
    selector: "dashboard"
})
@View({
    directives: [TreeComponent, ContextComponent, BreadcrumbComponent],
    template: `
                <div class="container">
                    
                    <div class="col-md-4">
                        <context [context]="dashboard"></context>
                    </div>

                    <div class="col-md-8">
                        <tree [directories]="directory"></tree>
                    </div>

                </div>
              `
})
export class DashboardComponent {

    directory: Object[];

    dashboard = {
        name: 'Dashboard',
        path: '/Dashboard',
        type: 'dashboard'
    };

    constructor(private dspaceService: DSpaceService) {
        
    }

    ngAfterViewInit() {
        this.directory = this.dspaceService.getDirectory();
        this.dspaceService.directory.subscribe(directory => {
            this.directory = directory;
        });
    }
    
}