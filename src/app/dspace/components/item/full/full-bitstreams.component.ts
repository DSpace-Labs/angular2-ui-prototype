import { Component, Input } from 'angular2/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { Bitstream } from '../../../models/bitstream.model';
import { ViewElementComponent } from '../view-element.component';

/**
 * Renders an overview of all bitstreams attached to this item.
 */
@Component({
    selector: 'item-full-bitstreams',
    directives: [ ViewElementComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <view-element [header]="componentTitle | translate">
                    <div id="bitstreams" class="file-list">
                        <div *ngFor="let bitstream of itemBitstreams;" class="file-wrapper row">

                            <!-- thumbnail -->
                            <div class="col-xs-6 col-sm-3">
                                <!-- perform a test to see if a thumbnail is available -->
                                <a [attr.href]="bitstream.retrieveLink" class="image-link">
                                    <img src="./static/images/NoThumbnail.svg">
                                </a>
                            </div>

                            <!-- description -->
                            <div class="col-xs-6 col-sm-7">
                                <dl class="file-metadata dl-horizontal">
                                    <dt>{{ 'item-view.full.full-bitstreams.description.name' | translate }}</dt>
                                    <dd class="word-break">{{bitstream.name}}</dd>
                                    <dt>{{ 'item-view.full.full-bitstreams.description.size' | translate }}</dt>
                                    <dd class="word-break">{{bitstream.size}}</dd>
                                    <dt>{{ 'item-view.full.full-bitstreams.description.format' | translate }}</dt>
                                    <dd class="word-break">{{bitstream.format}}</dd>
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
export class FullBitstreamsComponent {

    /**
     * 
     */
    @Input() private itemBitstreams: Bitstream;

    /**
     * 
     */
    private componentTitle: string = "item-view.full.full-bitstreams.title";

}
