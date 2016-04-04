import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {TreeComponent} from '../../navigation/tree.component';
import {ContextComponent} from '../../navigation/context.component';

/**
 * Community component for displaying the current community.
 * View contains sidebar context and tree hierarchy below current community.
 */
@Component({
    selector: 'community',
    directives: [TreeComponent, ContextComponent],
    template: ` 
                <div class="container" *ngIf="community">
                    
                    <div class="col-md-4">
                        <context [context]="community"></context>
                    </div>     
                    
                    <div class="col-md-8">
                        <tree [directories]="community.subcommunities.concat(community.collections)"></tree>
                        <div class="jumbotron">
                            <div class="container">
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
              `
})
export class CommunityComponent {

    /**
     * An object that represents the current community.
     *
     * TODO: replace object with inheritance model. e.g. community extends dspaceObject
     */
    community: Object;
    
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
        console.log('Community ' + params.get("id"));
        directory.loadObj('community', params.get("id")).then(community => {
            this.community = community;
            breadcrumb.visit(this.community);
        });
    }

}

                       