import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {DSpaceService} from '../dspace.service';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {ContextComponent} from '../../navigation/context.component';

/**
 * 
 */
@Component({
    selector: 'item',
    directives: [ContextComponent],
    template: `
                <div class="container" *ngIf="item">
                    
                    <div class="col-md-4">
                        <context [context]="item"></context>
                    </div>

                    <div class="col-md-8">                                
                        <div class="panel panel-default">
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

    /**
     * 
     */
    item: Object;
    
    /**
     * 
     */
    constructor(private params: RouteParams, private directory: DSpaceDirectory, private breadcrumb: BreadcrumbService) {
        console.log('Item ' + params.get("id"));
        directory.loadObj('item', params.get("id")).then(item => {
            this.item = item;
            breadcrumb.visit(this.item);
        });
    }

}


                    
