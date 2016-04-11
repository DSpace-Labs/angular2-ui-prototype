import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES,RouteConfig, RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {DSpaceService} from '../dspace.service';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {ContextComponent} from '../../navigation/context.component';


import {FullMetadataComponent} from './item/full/full-metadata.component.ts';
import {FullBitstreamsComponent} from './item/full/full-bitstreams.component';
import {FullCollectionsComponent} from './item/full/full-collections.component';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'item',
    directives: [ContextComponent, FullMetadataComponent, FullBitstreamsComponent, FullCollectionsComponent,ROUTER_DIRECTIVES],
    pipes: [TranslatePipe],
    template: `
                <div class="container" *ngIf="item">
                    <div class="col-xs-12 col-sm-12 col-md-9 main-content">
                        <a [routerLink]="['Items',{id:item.id}]">Show simple item record</a>

                        <context [context]="item"></context>
                        <div>

                            <item-full-metadata [itemData]="item.metadata"></item-full-metadata>

                            <item-full-bistreams [itemBitstreams]="item.bitstreams"></item-full-bistreams>

                            <item-full-collections [itemData]="item"></item-full-collections>

                             <a [routerLink]="['Items',{id:item.id}]">Show simple item record</a>
                        </div>
                    </div>
                </div>
              `
})
export class FullItemViewComponent {

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
                private breadcrumb: BreadcrumbService,
                translate : TranslateService) {
        console.log("entering full item view");
        console.log('Item ' + params.get("id"));
        directory.loadObj('item', params.get("id")).then(item => {
            this.item = item;
            breadcrumb.visit(this.item);
        });

        translate.setDefaultLang('en');
        translate.use('en');
    }

}



