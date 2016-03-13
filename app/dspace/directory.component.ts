import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

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

    }

    ngOnInit() {
        this.dSpaceService.getDirectory().then(directory => {
            this.directory = directory;
        });
    }

    ngAfterViewInit() {

    }

}