import {Component, Input} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {ListMetadataComponent} from './list-metadata.component';
import {ThumbnailComponent} from '../thumbnail.component';
import {Item} from '../../../models/item.model';


@Component({
    selector: 'list-entry',
    directives:[ListMetadataComponent, ThumbnailComponent],
    pipes: [TranslatePipe],
    template:
        `
            <div class="col-sm-2 hidden-xs">
               <item-thumbnail></item-thumbnail>
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

