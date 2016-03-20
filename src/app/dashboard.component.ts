import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {DSpaceService} from './dspace/dspace.service';

@Component({
    selector: "dashboard",
    template: `
                <div>
                    <h2>Dashboard</h2>
                    <ul>
                        <li *ngFor="#topCommunity of directory | async" >
                            {{ topCommunity.name }}
                        </li>
                    </ul>
                </div>
              `
})
export class DashboardComponent {

    directory: Observable<Object[]>;

    constructor(private dspaceService: DSpaceService) {
        this.directory = this.dspaceService.directory;
    }

    ngOnInit() {        
        this.dspaceService.loadDirectory();
    }

}

