import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {DSpaceService} from './dspace/dspace.service';

@Component({
    selector: "dashboard",
    template: `
                <div>
                    <h2>Dashboard</h2>
                    <ul>
                        <li *ngFor="#topCommunity of directory" >
                            {{ topCommunity.name }}
                        </li>
                    </ul>
                </div>
              `
})
export class DashboardComponent {

    directory: Object[];

    constructor(private dspaceService: DSpaceService) {
        
    }

    ngOnInit() {
        let db = this;

        this.dspaceService.getDirectory().then(directory => {
            db.directory = directory;
        });
    }

    ngAfterViewInit() {
        console.log('after view init');
    }

}

