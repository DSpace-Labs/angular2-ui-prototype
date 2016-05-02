import {Component} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {Bitstream} from '../../../models/bitstream.model';
import {ViewElementComponent} from '../view-element.component';

/**
 * Renders an overview of all bitstreams attached to this item.
 */
@Component({
    selector: 'item-full-bitstreams',
    inputs: ['itemBitstreams','itemThumbnail'],
    directives: [ViewElementComponent],
    pipes: [TranslatePipe],
    template: `
                <view-element [header]="componentTitle | translate">
                    <div id="bitstreams" class="file-list">
                        <div *ngFor="#bitstream of itemBitstreams;" class="file-wrapper row">

                            <!-- thumbnail -->
                            <div class="col-xs-6 col-sm-3">
                                <!-- perform a test to see if a thumbnail is available -->
                                <a [attr.href]="bitstream.retrieveLink" class="image-link">
                                    <img src="{{_thumbnailSource}}">
                                </a>
                            </div>

                            <!-- description -->
                            <div class="col-xs-6 col-sm-7">
                                <dl class="file-metadata dl-horizontal">
                                    <dt>{{'item-view.full.full-bitstreams.description.name' | translate}}</dt>
                                    <dd class="word-break">{{bitstream.name}}</dd>
                                    <dt>{{'item-view.full.full-bitstreams.description.size' | translate}}</dt>
                                    <dd class="word-break">{{bitstream.size}}</dd>
                                    <dt>{{'item-view.full.full-bitstreams.description.format' | translate}}</dt>
                                    <dd class="word-break">{{bitstream.format}}</dd>
                                </dl>
                            </div>

                            <div class="file-link col-xs-6 col-xs-offset-6 col-sm-2 col-sm-offset-0">
                                <a [attr.href]="bitstream.retrieveLink">{{'item-view.full.full-bitstreams.view-open' | translate}}</a>
                            </div>
                        </div>
                    </div>
                </view-element>
              `
})
export class FullBitstreamsComponent {

    private componentTitle: string = "item-view.full.full-bitstreams.title";

    private itemBitstreams: Bitstream;

    private itemThumbnail : String;
    // The default 'holder.js' image
    private _thumbnailSource = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2293%22%20height%3D%22120%22%20viewBox%3D%220%200%2093%20120%22%20preserveAspectRatio%3D%22none%22%3E%3C!--%0ASource%20URL%3A%20holder.js%2F93x120%3Ftext%3DNo%20Thumbnail%0ACreated%20with%20Holder.js%202.8.2.%0ALearn%20more%20at%20http%3A%2F%2Fholderjs.com%0A(c)%202012-2015%20Ivan%20Malopinsky%20-%20http%3A%2F%2Fimsky.co%0A--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%3C!%5BCDATA%5B%23holder_1543e460b05%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%5D%5D%3E%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1543e460b05%22%3E%3Crect%20width%3D%2293%22%20height%3D%22120%22%20fill%3D%22%23EEEEEE%22%2F%3E%3Cg%3E%3Ctext%20x%3D%2235.6171875%22%20y%3D%2257%22%3ENo%3C%2Ftext%3E%3Ctext%20x%3D%2210.8125%22%20y%3D%2272%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";

    ngOnInit()
    {
        this.itemBitstreams = this.itemBitstreams.filter(x => x.bundle == "ORIGINAL"); // filter for original bundle
        if(this.itemThumbnail!=null)
        {
            this._thumbnailSource = "http://localhost:5050/rest"+this.itemThumbnail;
        }
    }


}
