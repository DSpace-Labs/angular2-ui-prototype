import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../../dspace.directory';

import {DSpaceService} from '../../../dspace.service';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * Renders an overview of all bitstreams attached to this item.
 */
@Component({
    selector: 'item-full-bistreams',
    inputs: ['itemBitstreams'],
    pipes: [TranslatePipe],
    template:
        `
         <h3>{{'item-view.full.full-bitstreams.title' | translate}}</h3> <!-- TODO: I18N -->
            <div id="bitstreams" class="file-list">
                    <div *ngFor="#bitstream of itemBitstreams;" class="file-wrapper row">
                        <!-- thumbnail -->
                        <div class="col-xs-6 col-sm-3">
                            <!-- perform a test to see if a thumbnail is available -->
                            <a [attr.href]="'https://demo.dspace.org/rest'+bitstream.retrieveLink" class="image-link">
                                <img src="../../../../../../resources/images/NoThumbnail.svg">
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
                            <a [attr.href]="'https://demo.dspace.org/rest'+bitstream.retrieveLink">{{'item-view.full.full-bitstreams.view-open' | translate}}</a> <!-- hardcoded url to demo.org... -->
                        </div>
                    </div>
            </div>
        `
})

export class FullBitstreamsComponent {

    // Here we need the whole item object, not just the metadata.
    public itemBitstreams : Object;

    constructor(private params: RouteParams,private directory: DSpaceDirectory, translate : TranslateService)
    {
        translate.setDefaultLang('en');
        translate.use('en');
    }

}

