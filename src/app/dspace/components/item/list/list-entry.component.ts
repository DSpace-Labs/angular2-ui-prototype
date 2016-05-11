import { Component, Input } from '@angular/core';

import { ListMetadataComponent } from './list-metadata.component';
import { ThumbnailComponent } from '../thumbnail.component';
import { Item } from '../../../models/item.model';

/**
 *
 */
@Component({
    selector: 'list-entry',
    directives: [ ListMetadataComponent, ThumbnailComponent ],
    template:
        `
            <div class="col-sm-2 hidden-xs">
               <thumbnail [thumbnaillink]="item.thumbnail"></thumbnail>
            </div>
            <div class="col-sm-8 col-xs-12">
                 <item-list-metadata [item]="item"></item-list-metadata>
            </div>
            `
})
export class ListEntryComponent {

    /**
     * 
     */
    @Input() private item: Item;

}

