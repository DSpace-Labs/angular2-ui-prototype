import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";



/**
 * Component that displays the bitstreams of an item in the simple-item-view
 * Download on click.
 */
@Component({
    selector: 'item-bitstreams',
    inputs: ['itemBitstreams'],
    pipes: [TranslatePipe],
    template:
        `<div id="download">
            <h3>{{'item-view.bitstreams.title' | translate}}</h3>
            <div *ngFor="#bitstream of itemBitstreams; #index = index">
                <a [attr.href]="'https://demo.dspace.org/rest'+bitstream.retrieveLink">
                    <i aria-hidden="true" class="glyphicon glyphicon-file"></i>
                       {{bitstream.name}}
                </a>
            </div>
         </div>
        `
})

export class BitstreamsComponent {


    public itemBitstreams : Object;

    constructor(private params: RouteParams,private directory: DSpaceDirectory, translate : TranslateService)
    {
        console.log("setting up bitstreams");
        translate.setDefaultLang('en');
        translate.use('en');
    }

    ngOnInit()
    {
    }

}

