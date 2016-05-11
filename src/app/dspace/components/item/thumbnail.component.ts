import { Component, Input, OnChanges } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import {Bitstream} from "../../models/bitstream.model"
import {Item} from '../../models/item.model';
/**
 * Component that displays the bitstreams of an item in the simple-item-view
 * Download on click.
 * It gets the item bitstreams because I *think* that we could let the thumbnail download a bitstream?
 */
@Component({
    selector: 'thumbnail',
    pipes: [TranslatePipe],
    template: `
                <div class="thumbnail-wrapper">
                    <!-- TODO always renders the placehoder atm; make it use the actual thumbnail if it exists-->
                    <a [attr.href]="" class="image-link">
                        <img class="thumbnail-placeholder" alt="{{'item.thumbnail.no-thumbnail' | translate}} [93x120]" src="{{_thumbnailSource}}">
                    </a>
                </div>
              `
})
export class ThumbnailComponent implements OnChanges{


    @Input() thumbnaillink : string;
    // The default 'holder.js' image
    private _thumbnailSource = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2293%22%20height%3D%22120%22%20viewBox%3D%220%200%2093%20120%22%20preserveAspectRatio%3D%22none%22%3E%3C!--%0ASource%20URL%3A%20holder.js%2F93x120%3Ftext%3DNo%20Thumbnail%0ACreated%20with%20Holder.js%202.8.2.%0ALearn%20more%20at%20http%3A%2F%2Fholderjs.com%0A(c)%202012-2015%20Ivan%20Malopinsky%20-%20http%3A%2F%2Fimsky.co%0A--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%3C!%5BCDATA%5B%23holder_1543e460b05%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%5D%5D%3E%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1543e460b05%22%3E%3Crect%20width%3D%2293%22%20height%3D%22120%22%20fill%3D%22%23EEEEEE%22%2F%3E%3Cg%3E%3Ctext%20x%3D%2235.6171875%22%20y%3D%2257%22%3ENo%3C%2Ftext%3E%3Ctext%20x%3D%2210.8125%22%20y%3D%2272%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";

    constructor()
    {
    }

    ngOnChanges()
    {
        if(this.thumbnaillink!=null)
        {
            this._thumbnailSource = this.thumbnaillink;
        }
    }

}
