import { Component } from '@angular/core';
import {
    RouteConfig,
    RouterOutlet,
    RouteParams,
    CanDeactivate,
    ComponentInstruction
} from '@angular/router-deprecated';

import { DSpaceDirectory } from '../dspace.directory';
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';
import { GoogleScholarMetadataService } from "../../utilities/services/google-scholar-metadata.service.ts";
import { MetaTagService } from "../../utilities/meta-tag/meta-tag.service";
import { SidebarService } from "../../utilities/services/sidebar.service";

import { ObjectUtil } from "../../utilities/commons/object.util";

import { SimpleItemViewComponent } from './simple-item-view.component';
import { FullItemViewComponent } from './full-item-view.component';

import { Item } from "../models/item.model";

import { SidebarSection } from '../models/sidebar-section.model';

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

    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param dspace
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param gsMeta
     *      GoogleScholarMetadataService is a singleton service to set the <meta> tags for google scholar
     */
    constructor(private dspace: DSpaceDirectory,
                private breadcrumbService: BreadcrumbService,
                private gsMeta: GoogleScholarMetadataService,
                private params: RouteParams,
                private sidebarService : SidebarService) {
        dspace.loadObj('item', params.get("id")).then((item:Item) => {
            breadcrumbService.visit(item);
            this.gsMeta.setGoogleScholarMetaTags(item);
            this.item = item;
            this.populateSidebar();
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

        // removing from the sidebar
        this.sidebarService.removeComponent("itemsidebar");
        return true;
    }


    /**
     *
     */
    private populateSidebar()
    {
        // you can add routes as an object, or seperately by chaining "route"
        let builder = SidebarSection.getBuilder();
        let editSection = builder.name("sidebar.item-context.edit").route("Home").build();
        builder.resetBuild();
        let viewSection = builder.name("sidebar.item-context.view").route("Home").routeid(this.item.id).build();
        builder.resetBuild();
        let itemSection = builder.name("sidebar.item-context.header").addChild(viewSection).addChild(editSection).id("itemsidebar").index(2).build();
        this.sidebarService.addSection(itemSection);
    }
}
