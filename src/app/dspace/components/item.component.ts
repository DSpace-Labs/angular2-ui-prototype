import {Component} from 'angular2/core';
import {RouterOutlet, RouteConfig, RouteParams, CanDeactivate, ComponentInstruction, Location} from 'angular2/router';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';
import {BreadcrumbService} from '../../navigation/services/breadcrumb.service';
import {MetaTagService} from "../../utilities/meta-tag/meta-tag.service";
import {GoogleScholarMetadataUtil} from "../../utilities/google-scholar-metadata.util";
import {ObjectUtil} from "../../utilities/commons/object.util";

import {SimpleItemViewComponent} from './simple-item-view.component';
import {FullItemViewComponent} from './full-item-view.component';
import {ContextComponent} from '../../navigation/components/context.component';

import {Item} from "../models/item.model";

/**
 * Item component for displaying the current item. Routes to simple or item view.
 */
@Component({
    selector: 'item',
    directives: [ContextComponent, RouterOutlet],
    pipes: [TranslatePipe],
    providers: [GoogleScholarMetadataUtil],
    template: `
                <router-outlet></router-outlet>
              `
})
@RouteConfig([
    
        { path: "/", name: "SimpleItemView", component: SimpleItemViewComponent, useAsDefault: true },
        { path: "/full", name: "FullItemView", component: FullItemViewComponent }

])
export class ItemComponent implements CanDeactivate {

    /**
     * An object that represents the current item.
     */
    item: Item;

    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param directory
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param metaTagService`
     *      MetaTagService is a singleton service to add and remove <meta> tags to the DOM.
     * @param location
     *      Location
     * @param translate
     *      TranslateService
     */
    constructor(private params: RouteParams,
                private directory: DSpaceDirectory,
                private breadcrumb: BreadcrumbService,
                private metaTagService: MetaTagService,
                private gsMetaUtil: GoogleScholarMetadataUtil,
                private location: Location,
                translate: TranslateService) {
        directory.loadObj('item', params.get("id")).then((item:Item) => {
            this.item = item;
            breadcrumb.visit(this.item);
            this.gsMetaUtil.setGoogleScholarMetaTags(this.item);
        });
        translate.setDefaultLang('en');
        translate.use('en');
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
        if (ObjectUtil.hasValue(this.gsMetaUtil)) {
            this.gsMetaUtil.clearGoogleScholarMetaTags();
        }
        return true;
    }

}
