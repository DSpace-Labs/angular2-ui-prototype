import {Component, View} from 'angular2/core';

import {DSpaceService} from './dspace/dspace.service';

@Component({
    selector: "dashboard"
})
@View({
    template: `
                <div>
                    <h2>Dashboard</h2>
                </div>
              `
})
export class DashboardComponent {

    constructor(private dspaceService: DSpaceService) {
        
    }

    ngAfterViewInit() {

    }
    
}