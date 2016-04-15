import {Component, Input} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {Item} from '../../../models/item.model';
import {Metadatum} from '../../../models/metadatum.model';
import {MetadataHelper} from '../../../../utilities/metadata.helper';


/**
 * This component will display some metadata of the item in the list view.
 * We can select which metadata we want to show here.
 * Once again, we can pass an array of metadata.
 */
@Component({
    selector: 'item-list-metadata',
    inputs: ['item'],
    pipes: [TranslatePipe],
    template:
             `
                <a [attr.href]="'../items/'+item.id">
                    <h4>{{item.name}}</h4>
                </a>
                <h5>{{author}}</h5>
             `
})

export class ListMetadataComponent
{
    private item : Item;
    private author : String;

    ngOnInit()
    {
        let helper = new MetadataHelper();
        let filteredData : Metadatum[] = helper.filterMetadata(this.item.metadata,["dc.contributor.author"]);

        // We just want the first result, if there is one.
        if(filteredData.length > 0)
        {
            this.author = (filteredData[0].value);
        }
    }
}

