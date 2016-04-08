import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {DSpaceService} from '../dspace.service';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {ContextComponent} from '../../navigation/context.component';

import {AuthorsComponent} from './item/authors.component';

/**
 * A simple item view, the user first gets redirected here and can optionally view the full item view.
 *
 */

/**
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'simple-item-view',
    directives: [ContextComponent, AuthorsComponent],
    template: `
                <div class="container" *ngIf="item">

                    <div class="col-md-4">
                        <context [context]="item"></context>
                        <!-- authors and dates under here -->
                        <h1>Simple item view</h1>
                        <item-authors [metadataObject]="item.metadata"></item-authors>
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
export class SimpleItemViewComponent {

    /**
     * An object that represents the current item.
     *
     * TODO: replace object with inheritance model. e.g. item extends dspaceObject
     */
    item: Object;



    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param directory
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     */
    constructor(private params: RouteParams,
                private directory: DSpaceDirectory,
                private breadcrumb: BreadcrumbService) {
        console.log('Item ' + params.get("id"));
        directory.loadObj('item', params.get("id")).then(item => {
            this.item = item;
            console.log(item);
            breadcrumb.visit(this.item);
        });
    }

}



