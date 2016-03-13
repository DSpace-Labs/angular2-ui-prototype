import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'dspace-object'
})
@View({
     directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES],
    template: ` 
                <h1>DSpace Object</h1>
              `
})
export class DSpaceObjectComponent {
    
    constructor() {

    }

    ngAfterViewInit() {
        console.log("DSpace Object initialized.");
    }

}