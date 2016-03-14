import {Component, View} from 'angular2/core';
import {Router} from 'angular2/router';

import {DSpaceService} from './dspace.service';
import {BreadcrumbService} from './breadcrumb.service';

import {ContextComponent} from './context.component';
import {BreadcrumbComponent} from './breadcrumb.component';

@Component({
    selector: 'dspace-object'
})
@View({
    directives: [ContextComponent, BreadcrumbComponent],
    template: `
                <div class="container">
                    
                    <breadcrumb></breadcrumb>
                    
                    <div class="col-md-4">
                        <context [context]="item"></context>
                    </div>

                    <div class="col-md-8">
                        <div class="jumbotron">
                            <div class="container">
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
              `
})
export class ItemComponent {

    item: any;

    subscription: any;

    constructor(private breadcrumbService: BreadcrumbService, private dspaceService: DSpaceService) {
       this.setItem(this.breadcrumbService.getBreadcrumb());
    }

    setItem(item) {
        this.item = item;
        this.dspaceService.getItem(item.id);
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