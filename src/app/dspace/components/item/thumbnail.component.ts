import {Component} from 'angular2/core';

import {Bitstream} from "../../models/bitstream.model"

/**
 * Component that displays the bitstreams of an item in the simple-item-view
 * Download on click.
 * It gets the item bitstreams because I *think* that we could let the thumbnail download a bitstream?
 */
@Component({
    selector: 'item-thumbnail',
    inputs: ['itemBitstreams'],
    template: `
                <div id="thumbnail">
                    <!-- for now just display no thumbnail -->
                    <a [attr.href]="" class="image-link">
                        <img src="./static/images/NoThumbnail.svg">
                    </a>
                </div>
              `
})
export class ThumbnailComponent {

    private itemBitstreams: Array<Bitstream>;

}
