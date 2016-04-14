import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"
import {Bitstream} from "../../models/bitstream.model"

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {ComponentTitleComponent} from './component-title.component';


/**
 * Component that displays the bitstreams of an item in the simple-item-view
 * Download on click.
 */
@Component({
    selector: 'item-bitstreams',
    directives: [ComponentTitleComponent],
    inputs: ['itemBitstreams'],
    pipes: [TranslatePipe],
    template:
        `<div id="download">
            <component-title [title]="component_title"></component-title>
            <div *ngFor="#bitstream of itemBitstreams;">
                <a [attr.href]="bitstream.retrieveLink">
                    <i aria-hidden="true" class="glyphicon glyphicon-file"></i>
                       {{bitstream.name}}
                </a>
            </div>
         </div>
        `
})

export class BitstreamsComponent {

    private component_title = "item-view.bitstreams.title";
    private itemBitstreams : Bitstream[];

    constructor(private params: RouteParams,private directory: DSpaceDirectory, translate : TranslateService)
    {
        translate.setDefaultLang('en');
        translate.use('en');
    }



}

