import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"

import {TruncatePipe} from "../../../utilities/pipes/truncate.pipe"

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * Component that displays the bitstreams of an item in the simple-item-view
 * Download on click.
 */
@Component({
    selector: 'component-title',
    pipes: [TranslatePipe],
    inputs: ['title'],
    template:
        `
            <div id="title">
                <h3>{{title | translate}}</h3>
            </div>
        `
})

export class ComponentTitleComponent {


    private title : String;

    constructor(private params: RouteParams,private directory: DSpaceDirectory, translate : TranslateService)
    {
        translate.setDefaultLang('en');
        translate.use('en');
    }

}

