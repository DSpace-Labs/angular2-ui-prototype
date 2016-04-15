import {Component, Input} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {ListMetadataComponent} from './list-metadata.component';
import {ThumbnailComponent} from '../thumbnail.component';

/**
 * This component will display some metadata of the item in the list view.
 * We can select which metadata we want to show here.
 * Once again, we can pass an array of metadata.
 */
@Component({
    selector: 'list-entry',
    inputs: ['itemData'],
    directives:[ListMetadataComponent, ThumbnailComponent],
    pipes: [TranslatePipe],
    template:
            `
            <div class="col-md-4">
               <item-thumbnail></item-thumbnail>
            </div>
            <div class="col-md-8">
                 <item-list-metadata></item-list-metadata>
            </div>
            `
})

export class ListEntryComponent{


}

