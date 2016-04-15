import {Component, Input} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";


/**
 * This component will display some metadata of the item in the list view.
 * We can select which metadata we want to show here.
 * Once again, we can pass an array of metadata.
 */
@Component({
    selector: 'item-list-metadata',
    inputs: ['itemData'],
    pipes: [TranslatePipe],
    template:
             `
                <h3>title</h3>
                <h4>Author</h4>
             `
})

export class ListMetadataComponent{


}

