import {Component} from 'angular2/core';
import {AsyncRoute, RouteConfig} from 'angular2/router';

@Component({
    selector: 'collection',
    template: ``
})
@RouteConfig([
    new AsyncRoute({ path: '/:id', loader: () => Promise.resolve(CollectionComponent), name: 'Collections' })
])
export class CollectionComponent {

    constructor() {

    }    
}