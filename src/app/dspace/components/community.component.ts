import {Component} from 'angular2/core';
import {AsyncRoute, RouteConfig} from 'angular2/router';

@Component({
    selector: 'community',
    template: ``
})
@RouteConfig([    
        new AsyncRoute({ path: './:id', loader: () => Promise.resolve(CommunityComponent), name: 'Communities' })
])
export class CommunityComponent {

    constructor() {

    }

}