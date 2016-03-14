import {Component, View} from 'angular2/core';
import {Router} from 'angular2/router';

import {BreadcrumbComponent} from './breadcrumb.component';

import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'dspace-object'
})
@View({
    directives: [BreadcrumbComponent],
    template: `
                <div class="container">
                    <breadcrumb></breadcrumb>
                    <h1>Item</h1>
                    <div *ngFor='#key of keys'>
                        <span>{{key}}</span>: <span>{{item[key]}}</span>
                    </div>
                </div>
              `
})
export class ItemComponent {

    item: any;
    keys: any;

    subscription: any;

    constructor(private breadcrumbService: BreadcrumbService) {
       this.setItem(this.breadcrumbService.getBreadcrumb());
    }

    setItem(item) {
        this.item = item;
        this.keys = Object.keys(this.item);
    }

    ngOnInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(context => {
            this.setItem(context);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}