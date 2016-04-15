import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"
import {Bitstream} from "../../models/bitstream.model"

import {TranslatePipe} from "ng2-translate/ng2-translate";

import {ViewElementComponent} from './view-element.component'
/**
 * Component that displays the bitstreams (just the name) of an item in the simple-item-view
 * Download on click.
 */
@Component({
    selector: 'item-bitstreams',
    directives: [ViewElementComponent],
    inputs: ['itemBitstreams'],
    pipes: [TranslatePipe],
    template:
        `<view-element [header]="componentTitle | translate">
               <div *ngFor="#bitstream of itemBitstreams;">
                <a [attr.href]="bitstream.retrieveLink">
                    <i aria-hidden="true" class="glyphicon glyphicon-file"></i>
                       {{bitstream.name}}
                </a>
            </div>
        </view-element>
        `
})

export class BitstreamsComponent {

    private componentTitle = "item-view.bitstreams.title";
    private itemBitstreams : Bitstream[];

    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {
    }

}

