import {Component, View} from 'angular2/core';
import {AsyncRoute, RouteConfig} from 'angular2/router';

@Component({
    selector: 'item'
})
@RouteConfig([    
        new AsyncRoute({ path: './:id', loader: () => Promise.resolve(ItemComponent), name: 'Items' })
])
@View({
    template: ``
})
export class ItemComponent {

    constructor() {

    }

}