import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { Collection } from "../../dspace/models/collection.model";
import { PaginationComponent } from './pagination.component';

import { TruncatePipe } from '../../utilities/pipes/truncate.pipe';

/**
 * List component for navigation of the items of a collection.
 */
@Component({
    selector: 'list',
    directives: [ ROUTER_DIRECTIVES, PaginationComponent ],
    pipes: [ TruncatePipe ],
    template: `
                <ul class="hierarchy-list-group">
                    <li *ngFor="let item of collection.items" class="hierarchy-list-group-item">
                        <!-- Router Link -->
                        <a [routerLink]="[item.component, {id:item.id}]">{{ item.name }}</a>
                    </li>
                    <pagination [context]="collection"></pagination>
                </ul>
              `
})
export class ListComponent {

    /**
     * An input variable that is passed into the component [collection].
     * Represents the current collection.
     */
    @Input() collection: Collection;

}
