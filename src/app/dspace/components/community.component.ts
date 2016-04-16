import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';
import {BreadcrumbService} from '../../navigation/services/breadcrumb.service';
import {Community} from "../models/community.model";
import {TreeComponent} from '../../navigation/components/tree.component';
import {ContextComponent} from '../../navigation/components/context.component';
import {PaginationComponent} from '../../navigation/components/pagination.component';
import {ContainerHomeComponent} from "./container-home.component.ts";

/**
 * Community component for displaying the current community.
 * View contains sidebar context and tree hierarchy below current community.
 */
@Component({
    selector: 'community',
    directives: [TreeComponent, ContextComponent, ContainerHomeComponent],
    pipes: [TranslatePipe],
    template: ` 
                <div class="container" *ngIf="community">
                    
                    <div class="col-md-4">
                        <context [context]="community"></context>
                    </div>     
                    
                    <div class="col-md-8">
                        <container-home [container]=community></container-home>
                        <tree [directories]="community.subcommunities.concat(community.collections)"></tree>
                    </div>                          
                    
                </div>
              `
})
export class CommunityComponent {

    /**
     * An object that represents the current community.
     */
    community: Community;

    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param directory
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param translate
     *      TranslateService
     */
    constructor(private params: RouteParams, 
                private directory: DSpaceDirectory, 
                private breadcrumb: BreadcrumbService, 
                translate: TranslateService) {
        let page = params.get('page') ? params.get('page') : 1;
        directory.loadObj('community', params.get('id'), page, params.get('limit')).then((community:Community) => {
            this.community = community;
            breadcrumb.visit(this.community);
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}

                       