import { Component } from '@angular/core';
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
import { MetaTagService } from "../../utilities/meta-tag/meta-tag.service";
import { SidebarService } from "../../utilities/services/sidebar.service";

import { ObjectUtil } from "../../utilities/commons/object.util";

import { SimpleItemViewComponent } from './simple-item-view.component';
import { FullItemViewComponent } from './full-item-view.component';

import { Item } from "../models/item.model";

import { SidebarSection } from '../models/sidebar/sidebar-section.model';
import { ItemSidebarHelper } from '../../utilities/item-sidebar.helper';

import { AuthorizationService } from '../authorization/services/authorization.service';


/**
 * Item component for displaying the current item. Routes to simple or item view.
 */
@Component({
    selector: 'item',
    directives: [ RouterOutlet ],
    providers: [ GoogleScholarMetadataService ],
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


    sections : SidebarSection[] = [];

    sidebarHelper : ItemSidebarHelper;


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
     * @param sidebarService
     *      SidebarService is a singleton service to interact with our sidebar
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     */
    constructor(private dspace: DSpaceHierarchyService,
                private breadcrumbService: BreadcrumbService,
                private gsMeta: GoogleScholarMetadataService,
                private params: RouteParams,
                private sidebarService : SidebarService,
                private authorization : AuthorizationService) {
        dspace.loadObj('item', params.get("id")).then((item:Item) => {
            breadcrumbService.visit(item);
            this.gsMeta.setGoogleScholarMetaTags(item);
            this.item = item;

            // create the sidebar-helper to create the sidebar.
            this.sidebarHelper = new ItemSidebarHelper(this.sidebarService,this.item,this.authorization);
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
