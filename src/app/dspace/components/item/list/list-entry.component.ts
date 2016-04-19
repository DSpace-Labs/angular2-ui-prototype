import {Component, Input} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {ListMetadataComponent} from './list-metadata.component';
import {ThumbnailComponent} from '../thumbnail.component';
import {Item} from '../../../models/item.model';


@Component({
    selector: 'list-entry',
    inputs: ['item'],
    directives:[ListMetadataComponent, ThumbnailComponent],
    pipes: [TranslatePipe],
    template:
            `
            <div class="col-md-4">
            <!-- need to replace these with holder.js images -->
               <item-thumbnail></item-thumbnail>
            </div>
            <div class="col-md-8">
                 <item-list-metadata [item]="item"></item-list-metadata>
            </div>
            `
})

export class ListEntryComponent
{
    item : Item;
}

