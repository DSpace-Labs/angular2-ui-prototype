import {Metadatum}from './metadatum.model';
import {MetadataHelper} from '../../utilities/metadata.helper';
import {ArrayUtil} from '../../utilities/commons/array.util';


/**
 * A class that deals with some basic functions all components need.
 * Currently only deals with filtering for the metadata fields we want to display.
 */
export class ViewComponent
{

    /**
     *
     */
    filteredFields: Array<Metadatum>;

    /**
     *
     */
    metadataHelper : MetadataHelper;

    /**
     * Expects the fields that we want to filter for
     * e.g "dc.contributor.author, dc.identifier.other,.."
     * @param fields
     */
    constructor(public fields: Array<String>) {
        this.metadataHelper = new MetadataHelper();
    }

    /**
     * Filters the metadata based on the provided fields to filter for.
     * Expects an array of metadata
     * @param metadata
     */
    protected filterMetadata(metadata: Array<Metadatum>): void {
        this.filteredFields = this.metadataHelper.filterMetadata(metadata,this.fields);
    }

    /**
     * Checks if there is a result after filtering the metadata for the required fields.
     * @returns {boolean}
     */
    hasMetadata(): boolean {
        return ArrayUtil.isNotEmpty(this.filteredFields);
    }
}