import { Injectable, Inject } from '@angular/core';

import { ArrayUtil } from "../commons/array.util";
import { StringUtil } from "../commons/string.util";
import { ObjectUtil } from "../commons/object.util";

import { Item } from "../../dspace/models/item.model";
import { Metadatum } from "../../dspace/models/metadatum.model";
import { MetaTag } from "../meta-tag/meta-tag.model";
import { MetaTagService } from "../meta-tag/meta-tag.service";
import { URLHelper } from "../url.helper";

@Injectable()
export class GoogleScholarMetadataService {

    /**
     * An object that represents the current item.
     */
    private _item: Item;

    /**
     * The list of tags added by this instance
     */
    private _googleScholarTags: Array<MetaTag>;


    /**
     *
     * @param metaTagService`
     *      MetaTagService is a singleton service to add and remove <meta> tags to the DOM.
     */
    constructor(@Inject(MetaTagService) private metaTagService: MetaTagService) {
        this._googleScholarTags = new Array<MetaTag>();
    }

    /**
     *
     */
    get item(): Item {
        return this._item;
    }

    /**
     *
     */
    set item(item: Item) {
        this._item = item;
    }

    /**
     * Return the values matching the given set of metadata keys.
     * e.g. if keys = ['dc.contributor.author', 'dc.creator'] it will
     * return an array containing all author and creator names.
     *
     * @param metadata
     *      the Metadatum array to search in
     * @param keys
     *      an array of keys to search for
     * @returns {Array<string>}
     *      the values of the Metadatum objects matching the keys.
     */
    //TODO getting the values for a metadata field will most likely be useful in other places and should be moved to where it makes more sense
    private getValuesFor(metadata: Array<Metadatum>, keys: Array<string>): Array<string> {
        let combinedValues: Array<string> = new Array<string>();
        if (ArrayUtil.isNotEmpty(metadata) && ArrayUtil.isNotEmpty(keys)) {
            keys.forEach((key) => {
                let metadataMatchingKey = ArrayUtil.filterBy(metadata, 'key', key);
                let valuesMatchingKey = ArrayUtil.mapBy(metadataMatchingKey, 'value');
                valuesMatchingKey.forEach((value:string) => {
                    if (StringUtil.isNotBlank(value)) {
                        combinedValues.push(value);
                    }
                });
            });
        }
        return combinedValues;
    }

    /**
     * Return the first value matching the given set of metadata keys.
     * e.g. if keys = ['dc.contributor.author', 'dc.creator'] it will
     * return the first author it encounters, if there are no authors it
     * will return the first creator. If there are no creators either it
     * will return null
     *
     * @param metadata
     *      the Metadatum array to search in
     * @param keys
     *      an array of keys to search for
     * @returns {string}
     *      the value of the fist Metadatum object matching the keys.
     */
    private getFirstValueFor(metadata: Array<Metadatum>, keys: Array<string>): string {
        if (ArrayUtil.isNotEmpty(metadata) && ArrayUtil.isNotEmpty(keys)) {
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let metadatumMatchingKey = ArrayUtil.findBy(metadata, 'key', key);
                if (ObjectUtil.hasValue(metadatumMatchingKey)) {
                    return metadatumMatchingKey.value;
                }
            }
        }
        return null;
    }

    /**
     * Add the <meta> elements for google scholar to the <head>
     *
     * the calls that are commented out are the ones that arent configured
     * in a standard DSpace's google-metadata.properties file
     */
    public setGoogleScholarMetaTags(item: Item): void {
        this.item = item;
        this.setCitationTitleGSTag();
        this.setCitationAuthorGSTags();
        this.setCitationDateGSTag();
        this.setCitationISSNGSTag();
        this.setCitationISBNGSTag();
        // this.setCitationJournalTitleGSTag();
        // this.setCitationVolumeGSTag();
        // this.setCitationIssueGSTag();
        // this.setCitationFirstPageGSTag();
        // this.setCitationLastPageGSTag();
        // this.setCitationDOIGSTag();
        // this.setCitationPMIDGSTag();
        this.setCitationAbstractGSTag();
        // this.setCitationFullTextGSTag();
        this.setCitationPDFGSTag();
        this.setCitationLanguageGSTag();
        this.setCitationKeywordsGSTag();
        // this.setCitationConferenceGSTag();
        if (this.isDissertation()) {
            this.setCitationDissertationNameGSTag();
            this.setCitationDissertationInstitutionGSTag();
        }
        // if () {
        //     this.setCitationPatentCountryGSTag();
        //     this.setCitationPatentNumberGSTag();
        // }
        if (this.isTechReport()) {
            // this.setCitationTechReportNumberGSTag();
            this.setCitationTechReportInstitutionGSTag();
        }
    }

    /**
     * Add <meta name="citation_title" ... >  to the <head>
     */
    private setCitationTitleGSTag(): void {
        let values = this.getMetaTagContentsFor(['dc.title'], true, false);
        this.setGSTagsForField('citation_title', values);
    }

    /**
     * Add <meta name="citation_author" ... >  to the <head>
     */
    private setCitationAuthorGSTags(): void {
        let values = this.getMetaTagContentsFor(['dc.author', 'dc.contributor.author', 'dc.creator'], false, false);
        this.setGSTagsForField('citation_author', values);
    }

    /**
     * Add <meta name="citation_date" ... >  to the <head>
     */
    private setCitationDateGSTag(): void {
        let values = this.getMetaTagContentsFor(['dc.date.copyright', 'dc.date.issued', 'dc.date.available', 'dc.date.accessioned'], true, false);
        this.setGSTagsForField('citation_date', values);
    }

    /**
     * Add <meta name="citation_issn" ... >  to the <head>
     */
    private setCitationISSNGSTag(): void {
        let values = this.getMetaTagContentsFor(['dc.identifier.issn'], true, false);
        this.setGSTagsForField('citation_issn', values);
    }

    /**
     * Add <meta name="citation_isbn" ... >  to the <head>
     */
    private setCitationISBNGSTag(): void {
        let values = this.getMetaTagContentsFor(['dc.identifier.isbn'], true, false);
        this.setGSTagsForField('citation_isbn', values);
    }

    /**
     * Add <meta name="citation_abstract_html_url" ... >  to the <head>
     */
    private setCitationAbstractGSTag(): void {
        let itemUrl = URLHelper.relativeToAbsoluteUIURL(this.item.component.toLowerCase(), '/' + this.item.id);
        this.setGSTagsForField('citation_abstract_html_url', [itemUrl]);
    }

    /**
     * Add <meta name="citation_pdf_url" ... >  to the <head>
     */
    private setCitationPDFGSTag(): void {
        if (ObjectUtil.hasValue(this._item)) {
            let bitstreamsInOriginalBundle = this._item.getBitstreamsByBundleName('ORIGINAL');
            let pdfBitstream = ArrayUtil.findBy(bitstreamsInOriginalBundle, 'mimeType', 'application/pdf');
            if (ObjectUtil.hasValue(pdfBitstream)) {
                this.setGSTagsForField('citation_pdf_url', [pdfBitstream.retrieveLink]);
            }
        }
    }

    /**
     * Add <meta name="citation_language" ... >  to the <head>
     */
    private setCitationLanguageGSTag(): void {
        let values = this.getMetaTagContentsFor(['dc.language.iso'], true, false);
        this.setGSTagsForField('citation_language', values);
    }

    /**
     * Add <meta name="citation_keywords" ... >  to the <head>
     */
    private setCitationKeywordsGSTag(): void {
        let values = this.getMetaTagContentsFor(['dc.subject'], false, true);
        this.setGSTagsForField('citation_keywords', values);
    }

    /**
     * Add <meta name="citation_dissertation_name" ... >  to the <head>
     */
    private setCitationDissertationNameGSTag(): void {
        let values = this.getMetaTagContentsFor(['dc.title'], true, false);
        this.setGSTagsForField('citation_dissertation_name', values);
    }

    /**
     * Add <meta name="citation_dissertation_institution" ... >  to the <head>
     */
    private setCitationDissertationInstitutionGSTag(): void {
        let values = this.getMetaTagContentsFor(['dc.publisher'], true, false);
        this.setGSTagsForField('citation_dissertation_institution', values);
    }

    /**
     * Add <meta name="citation_technical_report_institution" ... >  to the <head>
     */
    private setCitationTechReportInstitutionGSTag(): void {
        let values = this.getMetaTagContentsFor(['dc.publisher'], true, false);
        this.setGSTagsForField('citation_technical_report_institution', values);
    }

    /**
     * Returns true if this._item is a dissertation
     *
     * @returns {boolean}
     *      true if this._item has a dc.type equal to 'Thesis'
     */
    private isDissertation(): boolean {
        if (ObjectUtil.hasNoValue(this._item)) {
            return false;
        }
        return ObjectUtil.hasValue(
            this._item.metadata.find((metadatum: Metadatum) => {
                return metadatum.key === 'dc.type'
                    && metadatum.value === 'Thesis';
            })
        );
    }

    /**
     * Returns true if this._item is a technical report
     *
     * @returns {boolean}
     *      true if this._item has a dc.type equal to 'Technical Report'
     */
    private isTechReport(): boolean {
        if (ObjectUtil.hasNoValue(this._item)) {
            return false;
        }
        return ObjectUtil.hasValue(
            this._item.metadata.find((metadatum: Metadatum) => {
                return metadatum.key === 'dc.type'
                    && metadatum.value === 'Technical Report';
            })
        );
    }

    /**
     * Return the values matching the given set of metadataKeys for this component's item
     *
     * If stopAfterFirstMatch = true only the first match will be included,
     * if combineInSingleTag = true all results will be combined in a single string,
     * separated by semicolons
     *
     * @param metadataKeys
     *      the array of keys to look for
     * @param stopAfterFirstMatch
     *      a boolean indicating whether it should stop searching after the first match
     * @param combineInSingleTag
     *      a boolean indicating whether the results should be combined in a single string
     * @returns {Array<string>}
     *      a Array<string> containing the matching values.
     */
    //TODO method does too many things: refactor
    private getMetaTagContentsFor(metadataKeys:Array<string>, stopAfterFirstMatch: boolean, combineInSingleTag: boolean): Array<string> {
        let values: Array<string> = new Array<string>();
        if (ObjectUtil.hasValue(this._item)) {
            if (stopAfterFirstMatch) {
                let value = this.getFirstValueFor(this._item.metadata, metadataKeys);
                if (ObjectUtil.hasValue(value)) {
                    values.push(value);
                }
            }
            else {
                values = this.getValuesFor(this._item.metadata, metadataKeys);
                if (combineInSingleTag) {
                    values = [values.join('; ')];
                }
            }
        }
        return values;
    }

    /**
     * Add a <meta> element with the given tagname to the DOM
     * for each of the given values
     *
     * @param metaTagName
     *      the name attribute for the new <meta> elements
     * @param values
     *      the content attributes for the new <meta> elements
     */
    private setGSTagsForField(metaTagName: string, values: Array<string>): void {
        values.forEach((value:string) => {
            let newTag = MetaTag.getBuilder()
                .name(metaTagName)
                .content(value)
                .build();
            this.metaTagService.addTag(newTag);
            this._googleScholarTags.push(newTag);
        });
    }

    /**
     * Removes all tags set by this instance.
     */
    public clearGoogleScholarMetaTags(): void {
        this.metaTagService.removeTags(this._googleScholarTags);
        this._googleScholarTags = new Array<MetaTag>();
    }

}
