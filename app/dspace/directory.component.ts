import {Component, View} from 'angular2/core';

import {DSpaceService} from './dspace.service';

import {TreeComponent} from './tree.component';

@Component({
    selector: 'directory'
})
@View({
    directives: [TreeComponent],
    template: ` 
                <tree [directories]="directory"></tree>
              `
})
export class DirectoryComponent {

    directory: Object;

    constructor(private dSpaceService: DSpaceService) {
        this.dSpaceService.getDirectory().then(directory => {
            this.directory = directory;
        });
    }

}