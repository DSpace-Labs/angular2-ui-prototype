import {Component} from 'angular2/core';
import {RouteParams, CanDeactivate, ComponentInstruction, Location} from 'angular2/router';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';

import {BreadcrumbService} from '../../navigation/breadcrumb.service';

import {ContextComponent} from '../../navigation/context.component';
import {MetaTagService} from "../../utilities/meta-tag/meta-tag.service";
import {Item} from "../models/item.model";
import {GoogleScholarMetadataUtil} from "../../utilities/google-scholar-metadata.util";
import {ObjectUtil} from "../../utilities/commons/object.util";



//TODO: THIS CLASS IS AT THE MOMENT NOT MOVED ANYMORE!

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
     * Helper class to set google scholar <meta> tags
     */
    _gsMetaUtil: GoogleScholarMetadataUtil;

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
                private location: Location,
                translate: TranslateService) {
        console.log('Item ' + params.get("id"));
        directory.loadObj('item', params.get("id"), 0).then(itemJSON => {
            this.itemJSON = itemJSON;
            this.item = new Item(itemJSON);
            breadcrumb.visit(this.itemJSON);
            this._gsMetaUtil = new GoogleScholarMetadataUtil(metaTagService, location, this.item);
            this._gsMetaUtil.setGoogleScholarMetaTags();
        });
        translate.setDefaultLang('en');
        translate.use('en');
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

        if (ObjectUtil.hasValue(this._gsMetaUtil)) {
            this._gsMetaUtil.clearGoogleScholarMetaTags();
        }
        return true;
    }
}


                    
