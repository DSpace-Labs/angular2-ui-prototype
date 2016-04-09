import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';

import {DSpaceService} from '../dspace.service';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {ContextComponent} from '../../navigation/context.component';

/**
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'item',
    directives: [ContextComponent],
    pipes: [TranslatePipe],
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
                                        <th>{{'item.metadata-number-indicator' | translate}}</th> <!-- not sure if this really requires i18n -->
                                        <th>{{'item.key' | translate}}</th>
                                        <th>{{'item.value' | translate}}</th>
                                        <th>{{'item.language' | translate}}</th>
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
     * An object that represents the current item.
     *
     * TODO: replace object with inheritance model. e.g. item extends dspaceObject
     */
    item: any;
    
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
                private breadcrumb: BreadcrumbService,
                translate: TranslateService) {
        directory.loadObj('item', params.get("id")).then(item => {
            this.item = item;
            breadcrumb.visit(this.item);
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}


                    
