import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from "ng2-translate/ng2-translate";

import {Item} from '../../../models/item.model';
import {Bitstream} from '../../../models/bitstream.model';
import {ViewElementComponent} from '../view-element.component';
import {ThumbnailComponent} from '../thumbnail.component';

import { ArrayUtil } from '../../../../utilities/commons/array.util'

/**
 * Renders an overview of all bitstreams attached to this item.
 */
@Component({
    selector: 'item-full-bitstreams',
    directives: [ViewElementComponent, ThumbnailComponent],
    pipes: [TranslatePipe],
    template: `
                <view-element [header]="componentTitle | translate">
                    <div id="bitstreams" class="file-list">
                        <div *ngFor="let bitstream of originalBitstreams;" class="file-wrapper row">

                            <!-- thumbnail -->
                            <div class="col-xs-6 col-sm-3">
                                <!-- the link we pass needs to match the current items name -->
                                <thumbnail [thumbnaillink]="matchingThumbnailUrl(bitstream.name)"></thumbnail>
                            </div>

                            <!-- description -->
                            <div class="col-xs-6 col-sm-7">
                                <dl class="file-metadata dl-horizontal">
                                    <dt>{{ 'item-view.full.full-bitstreams.description.name' | translate }}</dt>
                                    <dd class="word-break">{{bitstream.name}}</dd>
                                    <dt>{{ 'item-view.full.full-bitstreams.description.size' | translate }}</dt>
                                    <dd class="word-break">{{bitstream.size}}</dd>
                                    <dt>{{ 'item-view.full.full-bitstreams.description.format' | translate }}</dt>
                                    <dd class="word-break">{{bitstream.mimeType}}</dd>
                                </dl>
                            </div>

                            <div class="file-link col-xs-6 col-xs-offset-6 col-sm-2 col-sm-offset-0">
                                <a [attr.href]="bitstream.retrieveLink">{{ 'item-view.full.full-bitstreams.view-open' | translate }}</a>
                            </div>
                        </div>
                    </div>
                </view-element>
              `
})
export class FullBitstreamsComponent implements OnInit {

    /**
     * 
     */
    @Input() private itemBitstreams: Bitstream[];
    private originalBitstreams : Bitstream[]; // we only want to display the primary bitstream.

    @Input() private thumbnails : { [name:string] : string};

    private item : Item;


    constructor()
    {
    }

    ngOnInit()
    {
        this.originalBitstreams = ArrayUtil.filterBy(this.itemBitstreams, 'bundleName', 'ORIGINAL');
    }

    /**
     * 
     */
    private componentTitle: string = "item-view.full.full-bitstreams.title";


    matchingThumbnailUrl(bitstreamname): string
    {
          return this.thumbnails[bitstreamname];
    }

}
