import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';
import {DSpaceService} from '../dspace.service';
import {BreadcrumbService} from '../../navigation/services/breadcrumb.service';
import {ContextComponent} from '../../navigation/components/context.component';
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
                    <div class="row">
                        <div class="clearfix">

                            <div class="col-xs-6 col-sm-3">
                                <context [context]="item"></context>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-9 main-content">

                                <h1>{{item.name}}</h1>
                                <!-- link to the simple item view -->
                                <a [routerLink]="[item.component, {id: item.id}]">{{'item-view.show-simple' | translate}}</a>

                                <div>
                                    <!-- the rendering of different parts of the page is delegated to other components -->
                                    <item-full-metadata [itemData]="item.metadata"></item-full-metadata>

                                    <item-full-bistreams [itemBitstreams]="item.bitstreams"></item-full-bistreams>

                                    <item-full-collections [itemParent]="item.parentCollection"></item-full-collections>

                                    <a [routerLink]="[item.component, {id: item.id}]">{{'item-view.show-simple' | translate}}</a>
                                </div>
                            </div>

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
        directory.loadObj('item', params.get("id")).then((item:Item) => {
            this.item = item;
            breadcrumb.visit(this.item);
        });
    }

}
