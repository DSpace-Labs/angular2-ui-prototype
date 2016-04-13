import {Component} from 'angular2/core';
import {RouteParams, CanDeactivate, ComponentInstruction} from 'angular2/router';

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
                                        <th>#</th>
                                        <th>Key</th>
                                        <th>Value</th>
                                        <th>Language</th>
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

    item: Item;

    private _metaTagService: MetaTagService;
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
                private metaTagService: MetaTagService) {
        this._metaTagService = metaTagService;
        this._googleScholarTags = [];
        console.log('Item ' + params.get("id"));
        directory.loadObj('item', params.get("id")).then(itemJSON => {
            this.itemJSON = itemJSON;
            this.item = new Item(itemJSON);
            breadcrumb.visit(this.itemJSON);
            this.setGoogleScholarMetaTags();
        });
    }

    //TODO getting the values for a metadata field will most likely be useful in other places and should be moved to where it makes more sense
    private getValuesFor(metadata:Metadatum[], keys:string[]): string[] {
        let combinedValues:string[] = [];
        keys.forEach((key) => {
            let metadataMatchingKey = ArrayUtil.filterBy(metadata, 'key', key);
            let valuesMatchingKey = ArrayUtil.mapBy(metadataMatchingKey, 'value');
            valuesMatchingKey.forEach((value:string) => {
                if (StringUtil.isNotBlank(value)) {
                    combinedValues.push(value);
                }
            });
        });
        return combinedValues;
    }

    private getFirstValueFor(metadata:Metadatum[], keys:string[]): string {
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let metadatumMatchingKey = ArrayUtil.findBy(metadata, 'key', key);
            if (ObjectUtil.hasValue(metadatumMatchingKey)) {
                return metadatumMatchingKey.value;
            }
        }
        return null;
    }

    //TODO this isn't the entire set GS needs, it's just a proof of concept for now.
    private setGoogleScholarMetaTags(): void {
        this.setCitationTitleGSTags();
        this.setCitationAuthorGSTags();
        this.setCitationDateGSTags();
        this.setCitationISSNGSTags();
        this.setCitationISBNGSTags();
        this.setCitationKeywordsGSTag();
    }

    private setCitationTitleGSTags(): void {
        this.setGSTagsForField('citation_title', ['dc.title'], true, false);
    }

    private setCitationAuthorGSTags(): void {
        this.setGSTagsForField('citation_author', ['dc.author', 'dc.contributor.author','dc.creator'], false, false);
    }

    private setCitationDateGSTags(): void {
        this.setGSTagsForField('citation_date', ['dc.date.copyright', 'dc.date.issued', 'dc.date.available', 'dc.date.accessioned'], true, false);
    }

    private setCitationISSNGSTags(): void {
        this.setGSTagsForField('citation_issn', ['dc.identifier.issn'], true, false);
    }

    private setCitationISBNGSTags(): void {
        this.setGSTagsForField('citation_issn', ['dc.identifier.isbn'], true, false);
    }

    private setCitationKeywordsGSTag(): void {
        this.setGSTagsForField('citation_keywords', ['dc.subject', 'dc.type'], false, true);
    }

    //TODO method does too many things: refactor
    private setGSTagsForField(metaTagName: string, metadataKeys: string[], stopAfterFirstMatch: boolean, combineInSingleTag: boolean): void {
        if (ObjectUtil.isNotEmpty(this.item)) {
            let values:string[] = [];
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
            values.forEach((value:string) => {
                let newTag = MetaTag.getBuilder()
                    .name(metaTagName)
                    .content(value)
                    .build();
                this._metaTagService.addTag(newTag);
                this._googleScholarTags.push(newTag);
            });
        }
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


                    
