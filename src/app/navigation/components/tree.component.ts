import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { ListComponent } from './list.component';
import { PaginationComponent } from './pagination.component';



/**
 * Tree component for navigation through the dspace index of
 * communities, collections, and items. Keys off an enhanced property
 * on the given context named expanded. Displays +/- glyphicon for communities
 * and a open/closed folder for collections. The title of the given context is
 * a link.
 */
@Component({
    selector: 'tree',
    directives: [ ROUTER_DIRECTIVES,
                  TreeComponent,
                  ListComponent,
                  PaginationComponent ],
    pipes : [TranslatePipe],
    template: ` <!-- If a header i18n key is passed in, display it -->
                <h1 *ngIf="header">{{ header | translate }}</h1>
                <ul class="list-group">
                    <!-- Create an unordered list of all objects in our hierarchy, including expanded sub-hierarchies -->
                    <li *ngFor="let hierarchy of hierarchies" class="list-group-item">
                        <!-- Display clickable open/close icons -->
                        <span *ngIf="collapsedCommunity(hierarchy)" (click)="hierarchy.toggle()" class="ion-icon ion-ios-plus-empty clickable"></span>
                        <span *ngIf="expandedCommunity(hierarchy)" (click)="hierarchy.toggle()" class="ion-icon ion-ios-minus-empty clickable"></span>
                        <span *ngIf="collapsedCollection(hierarchy)" (click)="hierarchy.toggle()" class="ion-icon ion-ios-plus-empty clickable"></span>
                        <span *ngIf="expandedCollection(hierarchy)" (click)="hierarchy.toggle()" class="ion-icon ion-ios-minus-empty clickable"></span>

                        <!-- Router link -->
                        <a *ngIf="!page(hierarchy)" [routerLink]="[hierarchy.component, {id:hierarchy.id}]">{{ hierarchy.name }}</a>
                        <a *ngIf="pageWithoutLimit(hierarchy)" [routerLink]="[hierarchy.component, {id:hierarchy.id, page: hierarchy.page}]">{{ hierarchy.name }}</a>
                        <a *ngIf="pageWithLimit(hierarchy)" [routerLink]="[hierarchy.component, {id:hierarchy.id, page: hierarchy.page, limit: hierarchy.limit}]">{{ hierarchy.name }}</a>

                        <!-- Display item counts for Communities / Collections -->
                        <span *ngIf="community(hierarchy)" class="badge">{{ hierarchy.countItems }}</span>
                        <span *ngIf="collection(hierarchy)" class="badge">{{ hierarchy.numberItems }}</span>
                        <!-- If Community expanded, show sub-tree of child communities / collections -->
                        <div *ngIf="expandedCommunity(hierarchy)">
                            <tree [hierarchies]="subCommunitiesAndCollections(hierarchy)"></tree>
                        </div>
                        <!-- If Collection expanded, show pagination list of items -->
                        <div *ngIf="expandedCollectionWithItems(hierarchy)">
                            <list [collection]="hierarchy"></list>
                        </div>
                    </li>
                </ul>
              `
})

export class TreeComponent {

    /**
     * An input variable that is passed into the component [hierarchies].
     * Represents the current level(s) of the index hierarchy. The children navigation
     * is loaded upon selecting a given context. The subsequent children navigation
     * are lazy loaded.
     */
    @Input() private hierarchies: Array<any>;

    /**
     * Contains the i18n string to set the title
     * The string needs to match one in en.json
     * @type {string}
     */
    @Input() private header : string = "";

    /**
     *
     */
    private subCommunitiesAndCollections(hierarchy: any): Array<any> {
        return hierarchy.subcommunities.concat(hierarchy.collections);
    }

    /**
     *
     */
    private collapsedCommunity(hierarchy: any): boolean {
        return this.community(hierarchy) && !hierarchy.expanded;
    }

    /**
     *
     */
    private expandedCommunity(hierarchy: any): boolean {
        return this.community(hierarchy) && hierarchy.expanded;
    }

    /**
     *
     */
    private collapsedCollection(hierarchy: any): boolean {
        return this.collection(hierarchy) && !hierarchy.expanded;
    }

    /**
     *
     */
    private expandedCollection(hierarchy: any): boolean {
        return this.collection(hierarchy) && hierarchy.expanded;
    }

    /**
     *
     */
    private expandedCollectionWithItems(hierarchy: any): boolean {
        return this.expandedCollection(hierarchy) && hierarchy.items.length > 0;
    }

    /**
     *
     */
    private community(hierarchy: any): boolean {
        return hierarchy.type == 'community';
    }

    /**
     *
     */
    private collection(hierarchy: any): boolean {
        return hierarchy.type == 'collection';
    }

    /**
     *
     */
    private page(hierarchy: any): boolean {
        return hierarchy.page ? true : false;
    }

    /**
     *
     */
    private pageWithoutLimit(hierarchy: any): boolean {
        return this.page(hierarchy) && !hierarchy.limit;
    }

    /**
     *
     */
    private pageWithLimit(hierarchy: any): boolean {
        return this.page(hierarchy) && hierarchy.limit;
    }

}
