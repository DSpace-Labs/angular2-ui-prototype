import {Component} from 'angular2/core';
import {AsyncRoute, RouteConfig} from 'angular2/router';

@Component({
    selector: 'item',
    template: ``
})
@RouteConfig([    
        new AsyncRoute({ path: './:id', loader: () => Promise.resolve(ItemComponent), name: 'Items' })
])
export class ItemComponent {

    constructor() {

    }

}