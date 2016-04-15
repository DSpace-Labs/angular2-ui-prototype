import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES,RouteConfig, RouteParams} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';
import {DSpaceService} from '../dspace.service';
import {BreadcrumbService} from '../../navigation/breadcrumb.service';
import {ContextComponent} from '../../navigation/context.component';


import {FullMetadataComponent} from './item/full/full-metadata.component.ts';
import {FullBitstreamsComponent} from './item/full/full-bitstreams.component';
import {FullCollectionsComponent} from './item/full/full-collections.component';

import {Item} from '../models/item.model'

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
                        <a [routerLink]="['Items',{id:item.id}]">{{'item-view.show-simple' | translate}}</a> <!-- link to the simple item view -->
                        <context [context]="item"></context>
                        <div>
                            <!-- the rendering of different parts of the page is delegated to other components -->
                            <item-full-metadata [itemData]="item.metadata"></item-full-metadata>

                            <item-full-bistreams [itemBitstreams]="item.bitstreams"></item-full-bistreams>

                            <item-full-collections [itemData]="item.parentCollection"></item-full-collections>

                             <a [routerLink]="['Items',{id:item.id}]">{{'item-view.show-simple' | translate}}</a>
                        </div>
                    </div>
                </div>
              `
})
export class FullItemViewComponent {


    private item: Item;

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
        directory.loadObj('item', params.get("id")).then(itemjson => {
            this.item = new Item(itemjson);
            breadcrumb.visit(this.item);
        });
}

}



