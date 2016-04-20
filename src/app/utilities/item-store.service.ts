import {Injectable, Inject} from 'angular2/core';
import {Location} from 'angular2/router';
import {Item} from "../dspace/models/item.model";
import {Metadatum} from "../dspace/models/metadatum.model";
import {ArrayUtil} from "./commons/array.util";
import {StringUtil} from "./commons/string.util";
import {ObjectUtil} from "./commons/object.util";
import {MetaTag} from "./meta-tag/meta-tag.model";
import {MetaTagService} from "./meta-tag/meta-tag.service";


/**
 * Class to store the current item a user is viewing.
 * So we can use this when routing.
 * Just testing if this works really.
 */


export interface IItemStore
{
}


@Injectable()
export class ItemStoreService // automatically shared as a singleton instance.
{


    itemStore : IItemStore = { item : null };


    change(inputItem)
    {
        this.itemStore.item = inputItem;
    }






}