import {Component, View} from 'angular2/core';
import {AsyncRoute, RouteConfig} from 'angular2/router';

@Component({
    selector: 'collection'
})
@RouteConfig([
        new AsyncRoute({ path: './:id', loader: () => Promise.resolve(CollectionComponent), name: 'Collections' })
])
@View({
    template: ``
})
export class CollectionComponent {

    constructor() {

    }    
}