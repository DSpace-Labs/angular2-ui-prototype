import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"
import {Collection} from "../../models/collection.model"

import {TruncatePipe} from "../../../utilities/pipes/truncate.pipe"



import {ComponentTitleComponent} from './component-title.component';

/**
 * Component for the collections of the simple-item-view.
 * When you click on the collection name, it has to redirect to the right collection.
 */
@Component({
    selector: 'view-element',
    inputs: ['header'],
    directives: [ComponentTitleComponent],
    template:
            `
            <div id="simple-view-element">
                <h3 *ngIf="header">{{header}}</h3>
                <ng-content></ng-content>
            </div>
            `
})

export class ViewElementComponent {

}

