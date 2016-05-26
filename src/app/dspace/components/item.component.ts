import { Component, Inject } from '@angular/core';
import {
    RouteConfig,
    RouterOutlet,
    RouteParams,
    CanDeactivate,
    ComponentInstruction
} from '@angular/router-deprecated';

import { DSpaceHierarchyService } from '../services/dspace-hierarchy.service';
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';
import { GoogleScholarMetadataService } from "../../utilities/services/google-scholar-metadata.service.ts";

import { ObjectUtil } from "../../utilities/commons/object.util";

import { SimpleItemViewComponent } from './simple-item-view.component';
import { FullItemViewComponent } from './full-item-view.component';

import { Item } from "../models/item.model";

import { ItemSidebarHelper } from '../../utilities/item-sidebar.helper';



/**
 * Item component for displaying the current item. Routes to simple or item view.
 */
@Component({
    selector: 'item',
    directives: [ RouterOutlet ],
    providers: [ GoogleScholarMetadataService, ItemSidebarHelper ],
    template: `
                <router-outlet></router-outlet>
              `
})
@RouteConfig([

        { path: "/", name: "SimpleItemView", component: SimpleItemViewComponent, useAsDefault: true },
        { path: "/full", name: "FullItemView", component: FullItemViewComponent },

        { path: '/**', redirectTo: [ '/Dashboard' ] }

])
export class ItemComponent implements CanDeactivate {

    item : Item;

    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param gsMeta
     *      GoogleScholarMetadataService is a singleton service to set the <meta> tags for google scholar
     * @param sidebarHelper
     *      SidebarHelper is a helper-class to inject the sidebar sections when the user visits this component
     */
    constructor(private dspace: DSpaceHierarchyService,
                private breadcrumbService: BreadcrumbService,
                private gsMeta: GoogleScholarMetadataService,
                private params: RouteParams,
                @Inject(ItemSidebarHelper) private sidebarHelper : ItemSidebarHelper) {
        dspace.loadObj('item', params.get("id")).then((item:Item) => {
            breadcrumbService.visit(item);
            this.gsMeta.setGoogleScholarMetaTags(item);
            this.item = item;
            this.sidebarHelper.populateSidebar();
        });
    }

    /**
     * This method is called automatically when the user navigates away from this route. It is used
     * here to clear the google scholar meta tags.
     *
     * @param nextInstruction
     * @param prevInstruction
     * @returns {boolean}
     */
    routerCanDeactivate(nextInstruction: ComponentInstruction,
                        prevInstruction: ComponentInstruction): boolean | Promise<boolean> {
        if (ObjectUtil.hasValue(this.gsMeta)) {
            this.gsMeta.clearGoogleScholarMetaTags();
        }
        this.sidebarHelper.removeSections();
        return true;
    }

}
