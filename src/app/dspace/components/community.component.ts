import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet, RouteParams } from 'angular2/router';

import { DSpaceDirectory } from '../dspace.directory';
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';
import { Community } from "../models/community.model";

import { CommunityViewComponent } from './community-view.component';
import { CommunityCreateComponent } from './community-create.component';
import { CollectionCreateComponent } from './collection-create.component';

/**
 * Community component for displaying the current community.
 * View contains sidebar context and tree hierarchy below current community.
 */
@Component({
    selector: 'community',
    directives: [ RouterOutlet ],
    template: ` 
                <router-outlet></router-outlet>
              `
})
@RouteConfig([

        { path: "/", name: "Community", component: CommunityViewComponent, useAsDefault: true },
        { path: "/create-community", name: "CommunityCreate", component: CommunityCreateComponent },
        { path: "/create-collection", name: "CollectionCreate", component: CollectionCreateComponent }

])
export class CommunityComponent {

    /**
     *
     * @param dspace
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     */
    constructor(private dspace: DSpaceDirectory, 
                private breadcrumb: BreadcrumbService,
                private params: RouteParams) {
        dspace.loadObj('community', params.get('id'), params.get('page'), params.get('limit')).then((community:Community) => {
            breadcrumb.visit(community);
        });
    }

}
