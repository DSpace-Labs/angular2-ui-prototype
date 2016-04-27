import {Component, Input, OnChanges} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';
import {BreadcrumbService} from '../../navigation/services/breadcrumb.service';
import {Community} from "../models/community.model";
import {TreeComponent} from '../../navigation/components/tree.component';
import {ContextComponent} from '../../navigation/components/context.component';
import {PaginationComponent} from '../../navigation/components/pagination.component';
import {ContainerHomeComponent} from "./container-home.component.ts";

import {ItemListComponent} from './item-list.component';
import {Item} from '../models/item.model';

/**
 * Community component for displaying the current community.
 * View contains sidebar context and tree hierarchy below current community.
 */
@Component({
    selector: 'community',
    directives: [TreeComponent, ContextComponent, ContainerHomeComponent, ItemListComponent],
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

                     <div class="col-md-12">
                        <h3>{{'community.recent-submissions' | translate}}</h3>
                        <item-list [items]="items"></item-list>
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
     * An object that represents the current community.
     *
     * TODO communityJSON should be removed, I introduced it because the tree component was written to work with the JSON directly, and I didn't have the time to make it work with Community objects
     */
    @Input() communityJSON: any;


    items : Item[];

    communityid : any;
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
                translate: TranslateService) {
        directory.loadObj('community', params.get('id'), params.get('page'), params.get('limit')).then((community:Community) => {
            this.community = community;
            breadcrumb.visit(this.community);
        });


        this.directory.loadRecentItems('recentitems',"dashboard",0,5).then( (json:any) =>
        {
            console.log("loading recent items");
            let tempItems = [];
            for(let i : number = 0; i < json.length;i++)
            {
                let item : Item = new Item(json[i]);
                tempItems.push(item);
            }
            this.items = tempItems; // this will trigger the update cycle of angular2
            console.log("recent items loaded");
        });


        this.communityid = params.get('id') ? params.get('id') : 0;
    }


}

                       