import {Component, View} from 'angular2/core';
import {AsyncRoute, RouteConfig} from 'angular2/router';

@Component({
    selector: 'community'
})
@RouteConfig([    
        new AsyncRoute({ path: './:id', loader: () => Promise.resolve(CommunityComponent), name: 'Communities' })
])
@View({
    template: ``
})
export class CommunityComponent {

    constructor() {

    }

}