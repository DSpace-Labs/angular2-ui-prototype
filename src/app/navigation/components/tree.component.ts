import { Component, Input } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';

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
    template: `
                <ul class="list-group">
                    <li *ngFor="let directory of directories" class="list-group-item">
                        <span *ngIf="collapsedCommunity(directory)" (click)="directory.toggle()" class="glyphicon glyphicon-plus clickable"></span>
                        <span *ngIf="expandedCommunity(directory)" (click)="directory.toggle()" class="glyphicon glyphicon-minus clickable"></span>
                        <span *ngIf="collapsedCollection(directory)" (click)="directory.toggle()" class="glyphicon glyphicon-folder-close clickable"></span>
                        <span *ngIf="expandedCollection(directory)" (click)="directory.toggle()" class="glyphicon glyphicon-folder-open clickable"></span>

                        <!-- Router link -->
                        <a *ngIf="!page(directory)" [routerLink]="[directory.component, {id:directory.id}]">{{ directory.name }}</a>
                        <a *ngIf="pageWithoutLimit(directory)" [routerLink]="[directory.component, {id:directory.id, page: directory.page}]">{{ directory.name }}</a>
                        <a *ngIf="pageWithLimit(directory)" [routerLink]="[directory.component, {id:directory.id, page: directory.page, limit: directory.limit}]">{{ directory.name }}</a>

                        <span *ngIf="community(directory)" class="badge">{{ directory.countItems }}</span>
                        <span *ngIf="collection(directory)" class="badge">{{ directory.numberItems }}</span>
                        <div *ngIf="expandedCommunity(directory)">
                            <tree [directories]="subCommunitiesAndCollections(directory)"></tree>
                        </div>
                        <div *ngIf="expandedCollectionWithItems(directory)">
                            <list [collection]="directory"></list>
                        </div>
                    </li>
                </ul>
              `
})
export class TreeComponent {

    /**
     * An input variable that is passed into the component [directories]. 
     * Represents the current level of the index hierarchy. The children navigation 
     * is loaded upon selecting a given context. The subsequent children navigation
     * are lazy loaded.
     */
    @Input() private directories: Array<any>;
    
    /**
     *
     */
    private subCommunitiesAndCollections(directory: any): Array<any> {
        return directory.subcommunities.concat(directory.collections);
    }

    /**
     *
     */
    private collapsedCommunity(directory: any): boolean {
        return this.community(directory) && !directory.expanded;
    }

    /**
     *
     */
    private expandedCommunity(directory: any): boolean {
        return this.community(directory) && directory.expanded;
    }

    /**
     *
     */
    private collapsedCollection(directory: any): boolean {
        return this.collection(directory) && !directory.expanded;
    }

    /**
     *
     */
    private expandedCollection(directory: any): boolean {
        return this.collection(directory) && directory.expanded;
    }

    /**
     *
     */
    private expandedCollectionWithItems(directory: any): boolean {
        return this.expandedCollection(directory) && directory.items.length > 0;
    }

    /**
     *
     */
    private community(directory: any): boolean {
        return directory.type == 'community';
    }

    /**
     *
     */
    private collection(directory: any): boolean {
        return directory.type == 'collection';
    }

    /**
     *
     */
    private page(directory: any): boolean {
        return directory.page ? true : false;
    }

    /**
     *
     */
    private pageWithoutLimit(directory: any): boolean {
        return this.page(directory) && !directory.limit;
    }

    /**
     *
     */
    private pageWithLimit(directory: any): boolean {
        return this.page(directory) && directory.limit;
    }

}
