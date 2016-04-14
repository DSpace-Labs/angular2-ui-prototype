import {Component} from 'angular2/core';
import {RouteParams, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {ContextComponent} from '../../navigation/context.component';
import {MetaTagService} from "../../utilities/meta-tag/meta-tag.service";
import {MetaTag} from "../../utilities/meta-tag/meta-tag.model";
import {Item} from "../models/item.model";
import {Metadatum} from "../models/metadatum.model";
import {ArrayUtil} from "../../utilities/commons/array.util";
import {StringUtil} from "../../utilities/commons/string.util";
import {ObjectUtil} from "../../utilities/commons/object.util";

/**
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'item',
    directives: [ContextComponent],
    pipes: [TranslatePipe],
    template: `
                <div class="container" *ngIf="itemJSON">
                    
                    <div class="col-md-4">
                        <context [context]="itemJSON"></context>
                    </div>

                    <div class="col-md-8">                                
                        <div class="panel panel-default">
                            <div class="panel-heading">{{ itemJSON.name }}</div>
                            <div class="panel-body">
                                <p>{{ itemJSON.parentCollection.name }}: description</p>
                            </div>
                            <table class="table table-hover">
                                <thead class="thead-inverse">
                                    <tr>
                                        <th>{{'item.metadata-number-indicator' | translate}}</th> <!-- not sure if this really requires i18n -->
                                        <th>{{'item.key' | translate}}</th>
                                        <th>{{'item.value' | translate}}</th>
                                        <th>{{'item.language' | translate}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="#metadatum of itemJSON.metadata; #index = index">
                                        <th scope="row">{{ index }}</th>
                                        <td>{{ metadatum.key }}</td>
                                        <td>{{ metadatum.value }}</td>
                                        <td>{{ metadatum.language }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>


                </div>
              `
})
export class ItemComponent implements CanDeactivate {

    /**
     * An object that represents the current item.
     *
     * TODO: replace object with inheritance model. e.g. item extends dspaceObject
     */
    itemJSON: Object;

    /**
     * An object that represents the current item.
     */
    item: Item;

    /**
     * reference to the MetaTagService
     */
    private _metaTagService: MetaTagService;

    /**
     * The list of tags added by this component
     */
    private _googleScholarTags: MetaTag[];

    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param directory
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param metaTagService`
     *      MetaTagService is a singleton service to add and remove <meta> tags to the DOM.
     */
    constructor(private params: RouteParams, 
                private directory: DSpaceDirectory, 
                private breadcrumb: BreadcrumbService,
                private metaTagService: MetaTagService,
                translate: TranslateService) {
        this._metaTagService = metaTagService;
        this._googleScholarTags = [];
        console.log('Item ' + params.get("id"));
        directory.loadObj('item', params.get("id"), 0).then(itemJSON => {
            this.itemJSON = itemJSON;
            this.item = new Item(itemJSON);
            breadcrumb.visit(this.itemJSON);
            this.setGoogleScholarMetaTags();
        });
        translate.setDefaultLang('en');
        translate.use('en');
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
     * @returns {string[]}
     *      the values of the Metadatum objects matching the keys.
     */
    //TODO getting the values for a metadata field will most likely be useful in other places and should be moved to where it makes more sense
    private getValuesFor(metadata:Metadatum[], keys:string[]): string[] {
        let combinedValues:string[] = [];
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
    private getFirstValueFor(metadata:Metadatum[], keys:string[]): string {
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
     */
    //TODO this isn't the entire set GS needs, it's just a proof of concept for now.
    private setGoogleScholarMetaTags(): void {
        this.setCitationTitleGSTags();
        this.setCitationAuthorGSTags();
        this.setCitationDateGSTags();
        this.setCitationISSNGSTags();
        this.setCitationISBNGSTags();
        this.setCitationKeywordsGSTag();
    }

    /**
     * Add <meta name="citation_title" ... >  to the <head>
     */
    private setCitationTitleGSTags():void {
        let values = this.getMetaTagContentsFor(['dc.title'], true, false);
        this.setGSTagsForField('citation_title', values);
    }

    /**
     * Add <meta name="citation_author" ... >  to the <head>
     */
    private setCitationAuthorGSTags():void {
        let values = this.getMetaTagContentsFor(['dc.author', 'dc.contributor.author', 'dc.creator'], false, false);
        this.setGSTagsForField('citation_author', values);
    }

    /**
     * Add <meta name="citation_date" ... >  to the <head>
     */
    private setCitationDateGSTags():void {
        let values = this.getMetaTagContentsFor(['dc.date.copyright', 'dc.date.issued', 'dc.date.available', 'dc.date.accessioned'], true, false);
        this.setGSTagsForField('citation_date', values);
    }

    /**
     * Add <meta name="citation_issn" ... >  to the <head>
     */
    private setCitationISSNGSTags():void {
        let values = this.getMetaTagContentsFor(['dc.identifier.issn'], true, false);
        this.setGSTagsForField('citation_issn', values);
    }

    /**
     * Add <meta name="citation_issn" ... >  to the <head>
     */
    private setCitationISBNGSTags():void {
        let values = this.getMetaTagContentsFor(['dc.identifier.isbn'], true, false);
        this.setGSTagsForField('citation_isbn', values);
    }

    /**
     * Add <meta name="citation_keywords" ... >  to the <head>
     */
    private setCitationKeywordsGSTag(): void {
        let values = this.getMetaTagContentsFor(['dc.subject', 'dc.type'], false, true);
        this.setGSTagsForField('citation_keywords', values);
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
     * @returns {string[]}
     *      a string[] containing the matching values.
     */
    //TODO method does too many things: refactor
    private getMetaTagContentsFor(metadataKeys:string[], stopAfterFirstMatch:boolean, combineInSingleTag:boolean): string[] {
        let values:string[] = [];
        if (ObjectUtil.isNotEmpty(this.item)) {
            if (stopAfterFirstMatch) {
                let value = this.getFirstValueFor(this.item.metadata, metadataKeys);
                if (ObjectUtil.hasValue(value)) {
                    values.push(value);
                }
            }
            else {
                values = this.getValuesFor(this.item.metadata, metadataKeys);
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
    private setGSTagsForField(metaTagName: string, values: string[]): void {
        values.forEach((value:string) => {
            let newTag = MetaTag.getBuilder()
                .name(metaTagName)
                .content(value)
                .build();
            this._metaTagService.addTag(newTag);
            this._googleScholarTags.push(newTag);
        });
    }


    /**
     * This method is called automatically when the user navigates away from this route. It is used
     * here to clear the google scholar meta tags.
     *
     * @param nextInstruction
     * @param prevInstruction
     * @returns {boolean}
     */
    routerCanDeactivate(nextInstruction: ComponentInstruction,
                        prevInstruction: ComponentInstruction): boolean | Promise<boolean> {

        this._metaTagService.removeTags(this._googleScholarTags);
        this._googleScholarTags = [];
        return true;
    }
}


                    
