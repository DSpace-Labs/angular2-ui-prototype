import {Component, View} from 'angular2/core';

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
                        <div class="panel panel-default" *ngIf="item.second">
                            <div class="panel-heading">{{ item.name }}</div>
                            <div class="panel-body">
                                <p>{{ item.parentCollection.name }}: description</p>
                            </div>
                            <table class="table table-hover">
                                <thead class="thead-inverse">
                                    <tr>
                                        <th>#</th>
                                        <th>Key</th>
                                        <th>Value</th>
                                        <th>Language</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="#metadatum of item.metadata; #index = index">
                                        <th scope="row">{{ index }}</th>
                                        <td>{{ metadatum.key }}</td>
                                        <td>{{ metadatum.value }}</td>
                                        <td>{{ metadatum.language }}</td>
                                    </tr>
                                </tbody>
                            </table>
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

    // Ready available data, get more data.
    setItem(item) {
        this.item = item;
        this.dspaceService.getItem(item).then(itemWithMetadata => {
            this.item = itemWithMetadata;
        });
    }

    ngOnInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(context => {
            if (context.type == 'item') {
                this.setItem(context);
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}