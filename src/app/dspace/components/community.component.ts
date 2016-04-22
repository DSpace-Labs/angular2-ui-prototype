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
                        <tree [directories]="communityJSON.subcommunities.concat(communityJSON.collections)"></tree>
                    </div>

                     <div class="col-md-12">
                        <h3>{{'community.recent-submissions' | translate}}</h3>
                        <item-list [items]="items"></item-list>

                        <h3 *ngIf="!loadedCollections">{{loadCollectionItems()}}</h3>
                     </div>
                    
                </div>
              `
})
export class CommunityComponent {

    /**
     * An object that represents the current community.
     */
    community: Community;

    loadedCollections = false;

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
        let page = params.get('page') ? params.get('page') : 1;
        directory.loadObj('community', params.get('id'), page).then(communityJSON =>
        {
            this.communityJSON = communityJSON;
            this.community = new Community(this.communityJSON);
            breadcrumb.visit(this.communityJSON);
        });
        this.communityid = params.get('id') ? params.get('id') : 0;
    }


    loadCollectionItems()
    {
        let tempItems = [];
        let counter : number = 0;

        console.log("loading the collections");
        if(this.communityJSON.collections != null && this.communityJSON.collections.length != 0)
        {
           this.loadedCollections = true;


            this.communityJSON.collections.forEach( c =>
            {
                this.directory.loadRecentItems("recentitems","community",c.id,5).then( (itemjson:any) =>
                {
                    console.log("in the lambda of the recent items");
                    for(let k : number = 0; k < itemjson.length; k++)
                    {
                        if(tempItems.length < 5)
                        {
                            tempItems.push(new Item(itemjson[k]));
                        }
                        else
                        {
                            this.updateItems(tempItems);
                        }
                    }
                }).then( () =>
                    {
                        counter++;
                        if(counter == this.community.collections.length)
                        {
                            this.updateItems(tempItems);
                        }
                    }
                );
            });

        }


    }

    updateItems(inputArray?)
    {
        console.log("updating items..");
        this.items = inputArray; // we have to replace the this.items with a new item, to trigger 'onChanges'. It is not triggered for altering an existing array.
    }


    ngAfterContentChecked()
    {
        /*
        console.log("content checked");
        if(this.community != null && this.community.collections.length != 0)
        {
            console.log("items in this community: "+ this.community.collections.length);
        }
        */
    }
}

                       