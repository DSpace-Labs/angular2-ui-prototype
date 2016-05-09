import {Metadatum}from './metadatum.model';
import {MetadataHelper} from '../../utilities/metadata.helper';
/**
 * A class that deals with some basic functions all components need.
 * Such as, metadata filtering
 */


export class ViewComponent
{

    filteredFields: Array<Metadatum>;
    metadataHelper : MetadataHelper;

    constructor(public fields : Array<String>)
    {
        this.metadataHelper = new MetadataHelper();
    }

    protected filterMetadata(metadata : Array<Metadatum>) : void
    {
        this.filteredFields = this.metadataHelper.filterMetadata(metadata,this.fields);
    }

    hasMetadata() : boolean
    {
        return this.filteredFields.length > 0;
    }
}