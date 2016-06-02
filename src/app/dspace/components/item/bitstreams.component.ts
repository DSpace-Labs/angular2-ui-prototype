import { Component, Input, OnInit } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { Bitstream } from "../../models/bitstream.model"
import { ViewElementComponent } from './view-element.component'

import { ArrayUtil } from '../../../utilities/commons/array.util'

/**
 * Component that displays the bitstreams (just the name) of an item in the simple-item-view.
 * Download on click.
 */
@Component({
    selector: 'item-bitstreams',
    directives: [ ViewElementComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <!--<view-element *ngIf="hasOriginalBitstreams()" [header]="componentTitle | translate">-->
                <view-element *ngIf="hasOriginalBitstreams()" class="simple-item-view-bitstreams">
                    <div *ngFor="let bitstream of originalBitstreams;">
                        <a [attr.href]="bitstream.retrieveLink">
                            <i aria-hidden="true" class="ion-icon ion-document"></i>
                            <span>{{ bitstream.name }}</span>
                        </a>
                    </div>
                </view-element>
              `
})
export class BitstreamsComponent implements OnInit {

    /**
     * 
     */
    @Input() private itemBitstreams: Array<Bitstream>;

    /**
     * 
     */
    private componentTitle: string = "item-view.header.bitstreams";

    /**
     * 
     */
    private originalBitstreams : Array<Bitstream>;

    /**
     * Verify whether or not this.originalBitstreams is empty
     *
     * @returns {boolean}
     *      true if this.originalBitstreams is not empty, false otherwise
     */
    hasOriginalBitstreams(): boolean {
        return ArrayUtil.isNotEmpty(this.originalBitstreams);
    }

    /**
     * 
     */
    ngOnInit() {
        this.originalBitstreams = ArrayUtil.filterBy(this.itemBitstreams, 'bundleName', 'ORIGINAL');
    }
}
