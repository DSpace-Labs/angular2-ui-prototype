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
                        <span *ngIf="directory.type == 'community' && !directory.expanded" (click)="directory.toggle()" class="glyphicon glyphicon-plus clickable"></span>
                        <span *ngIf="directory.type == 'community' && directory.expanded" (click)="directory.toggle()" class="glyphicon glyphicon-minus clickable"></span>
                        <span *ngIf="directory.type == 'collection' && !directory.expanded" (click)="directory.toggle()" class="glyphicon glyphicon-folder-close clickable"></span>
                        <span *ngIf="directory.type == 'collection' && directory.expanded" (click)="directory.toggle()" class="glyphicon glyphicon-folder-open clickable"></span>
                        <!-- Router link -->
                        <a *ngIf="!directory.page" [routerLink]="[directory.component, {id:directory.id}]">{{ directory.name }}</a>
                        <a *ngIf="directory.page && !directory.limit" [routerLink]="[directory.component, {id:directory.id, page: directory.page}]">{{ directory.name }}</a>
                        <a *ngIf="directory.page && directory.limit" [routerLink]="[directory.component, {id:directory.id, page: directory.page, limit: directory.limit}]">{{ directory.name }}</a>
                        <span *ngIf="directory.type == 'community'" class="badge">{{ directory.countItems }}</span>
                        <span *ngIf="directory.type == 'collection'" class="badge">{{ directory.numberItems }}</span>
                        <div *ngIf="directory.expanded && directory.type == 'community'">
                            <tree [directories]="subCommunitiesAndCollections(directory)"></tree>
                        </div>
                        <div *ngIf="directory.expanded && directory.type == 'collection' && directory.items.length > 0">
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
    
    private subCommunitiesAndCollections(directory: any): Array<any> {
        return directory.subcommunities.concat(directory.collections);
    }

}
