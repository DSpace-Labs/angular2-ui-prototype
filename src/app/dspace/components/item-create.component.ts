import { Component } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import {
    FORM_DIRECTIVES,
    FORM_BINDINGS,
    ControlGroup,
    Control,
    FormBuilder,
    NgForm,
    Validators
} from '@angular/common';

import { Observable } from 'rxjs/Rx';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../authorization/services/authorization.service';
import { ContextProviderService } from '../services/context-provider.service';
import { DSpaceService } from '../services/dspace.service';
import { DSpaceHierarchyService } from '../services/dspace-hierarchy.service';
import { FormService } from '../../utilities/form/form.service';
import { NotificationService } from '../../utilities/notification/notification.service';

import { FormSecureComponent } from '../../utilities/form/form-secure.component';
import { LoaderComponent } from '../../utilities/loader.component';
import { ItemBitstreamAddComponent } from './item-bitstream-add.component';
import { ItemMetadataInputComponent } from './item-metadata-input.component';

import { Bitstream } from '../models/bitstream.model';
import { FormInput } from '../../utilities/form/form-input.model';
import { Item } from "../models/item.model";
import { Metadatum } from '../models/metadatum.model';

import { BitstreamUploader } from '../services/bitstream-uploader.service';

/**
 *
 */
@Component({
    selector: 'item-create',
    bindings: [ FORM_BINDINGS ],
    pipes: [ TranslatePipe ],
    directives: [ FORM_DIRECTIVES,
                  LoaderComponent,
                  ItemBitstreamAddComponent,
                  ItemMetadataInputComponent ],
    template: `
                <h1>{{ 'item.create.header' | translate }}</h1>
                <loader *ngIf="processing" [message]="processingMessage()"></loader>
                <div *ngIf="processing">
                    <label>{{ 'item.file-upload.queue.progress' | translate:{count: uploader.queue.length} }}</label>
                    <div class="progress" style="">
                        <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': uploader.progress + '%' }"></div>
                    </div>
                </div>

                <!-- Display the form -->
                <form *ngIf="showForm()" [ngFormModel]="form" (ngSubmit)="createItem()" novalidate>
                    <!-- Add bitstreams/files -->
                    <item-bitstream-add [uploader]="uploader"></item-bitstream-add>

                    <!-- As long as the default form has a Type input field, we'll display it first -->
                    <!-- Select to change form to a given type, which loads a new type-based form -->
                    <h4><label *ngIf="hasTypeInput()" for="type">{{ 'item.create.type-select' | translate }}</label></h4>
                    <select *ngIf="hasTypeInput()" class="form-control" id="type" [(ngModel)]="selected" (ngModelChange)="typeSelected($event)">>
                        <option *ngFor="let option of typeInput.options" [ngValue]="option">{{ option.gloss }}</option>
                    </select>

                    <!-- Display all other form inputs (based on type, if exists) -->
                    <item-metadata-input [form]="form" [metadatumInputs]="metadatumInputs"
                                         (addMetadatumInputEmitter)="addMetadatumInput($event)"
                                         (removeMetadatumInputEmitter)="removeMetadatumInput($event)">
                    </item-metadata-input>
                    <!-- Form buttons -->
                    <div class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="reset()">{{ 'item.create.reset-button' | translate }}</button>
                        <button type="submit" class="btn btn-primary btn-sm" [disabled]="disabled()">{{ 'item.create.submit-button' | translate }}</button>
                    </div>
                </form>
              `
})
export class ItemCreateComponent extends FormSecureComponent {

    /**
     * Selected type from options within default to generic item.json form
     */
    private selected: any;

    /**
     * Type input from the initial item.json
     */
    private typeInput: FormInput;

    /**
     * Metadata input fields.
     */
    private metadatumInputs: Array<FormInput>;

    /**
     * Uploader to use. This bitstream uploader manages the
     * queue of files to upload as well as the upload process itself.
     */
    public uploader:BitstreamUploader;

    /**
     * Item being created. ngModel
     */
    private item: Item;

    /**
     *
     * @param translate
     *      TranslateService
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     * @param dspaceService
     *      DSpaceService is a singleton service to interact with the dspace service.
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param notificationService
     *      NotificationService is a singleton service to notify user of alerts.
     * @param formService
     *      FormService is a singleton service to retrieve form data.
     * @param builder
     *      FormBuilder is a singleton service provided by Angular2.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(private translate: TranslateService,
                private contextProvider: ContextProviderService,
                private dspaceService: DSpaceService,
                private dspace: DSpaceHierarchyService,
                private notificationService: NotificationService,
                formService: FormService,
                builder: FormBuilder,
                authorization: AuthorizationService,
                router: Router) {
        super(formService, builder, authorization, router);

        // Initialize our uploader
        this.uploader = new BitstreamUploader(translate, dspaceService, notificationService, {});

        this.init();
    }

    /**
     * Initialize the item metadata form and validators.
     * Also called to reinitialize (i.e. reload) the form when a type is selected.
     */
    init(): void {
        this.item = new Item();
        this.formService.getForm(this.selected ? this.selected.form : 'item').subscribe(inputs => {
            // For an item, the form consists of MetadatumInputs
            this.metadatumInputs = inputs;

            let formControls = {};

            // For each input in our form
            for(let input of this.metadatumInputs) {
                // set default value
                input.value = input.default ? input.default : '';

                if(input.key == "dc.type") {
                    // set selected to first option
                    this.selected = input.options[0];
                    //set value and gloss to selected
                    input.value = this.selected.value;
                    input.gloss = this.selected.gloss;
                    // hide field
                    input.hidden = true;
                    // set typeInput if undefined
                    if(this.typeInput === undefined) {
                        this.typeInput = input;
                    }
                }

                // create validators for field
                let validators = this.formService.createValidators(input);
                formControls[input.id] = new Control('', Validators.compose(validators));
            }
            this.form = this.builder.group(formControls);

            this.active = true;
        },
        errors => {
            console.error('Error: ' + errors);
        });
    }

    /**
     * Sets the item metadata values with ngModel values from metadata inputs.
     */
    setMetadataValues(): void {
        let typeIncluded = false;
        for(let input of this.metadatumInputs) {
            if(input.value) {
                this.item.addMetadata(new Metadatum(input)); // use addMetadata to trigger changedetection
                // set item name equal dc.title
                if(input.key == "dc.title") {
                    this.item.name = input.value;
                }
                // check if type is already included
                if(input.key == "dc.type") {
                    typeIncluded = true;
                }
            }
        }

        // add type to metadata if having type input and not already included
        if(this.hasTypeInput() && !typeIncluded) {
            this.typeInput.value = this.selected.value;
            this.item.addMetadata(new Metadatum(this.typeInput));
        }
    }

    /**
     * Message to display while processing item create.
     * @return processing message text
     */
    processingMessage(): string {
        return this.translate.instant('item.create.processing', { name: this.item.name });
    }

    /**
     * Refresh the form and context, navigate to origin context, and add notification.
     * @param itemName name of item being created
     * @param currentContext reference to current location/context
     */
    finish(itemName: string, currentContext: any): void {
        this.reset();
        this.dspace.refresh(currentContext);
        this.router.navigate(['/Collections', { id: currentContext.id }]);
        this.notificationService.notify('app', 'SUCCESS', this.translate.instant('item.create.success', { name: itemName }), 15);
    }

    /**
     * Add metadatum input to the current form.
     *
     * @param input
     *      FormInput to be added to metadata
     */
    private addMetadatumInput(input: FormInput): void {
        for(let i = this.metadatumInputs.length - 1; i >= 0; i--) {
            if(this.metadatumInputs[i].key == input.key) {
                let clonedInput = this.cloneInput(this.metadatumInputs[i]);
                let validators = this.formService.createValidators(clonedInput);
                this.metadatumInputs.splice(i+1, 0, clonedInput);
                this.form.addControl(clonedInput.id, new Control('', Validators.compose(validators)));
                break;
            }
        }
    }

    /**
     * Removes metadatum input from the current form.
     *
     * @param input
     *      FormInput to be removed from metadata
     */
    private removeMetadatumInput(input: FormInput): void {
        for(let i = this.metadatumInputs.length - 1; i >= 0; i--) {
            if(this.metadatumInputs[i].id == input.id) {
                this.metadatumInputs.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Clones a input.
     *
     * @param input
     *      FormInput to be cloned
     * @return new FormInput that is a clone of the one passed in
     */
    private cloneInput(input: FormInput): FormInput {
        let clonedInput = new FormInput(JSON.parse(JSON.stringify(input)));
        clonedInput.repeat = clonedInput.repeat ? ++clonedInput.repeat : 1;
        clonedInput.value = '';
        if(clonedInput.validation.required && clonedInput.validation.required.value) {
            clonedInput.validation.required.value = false;
        }
        return clonedInput;
    }

    /**
     * Create item. First creates the item through request and then joins multiple requests for bitstreams.
     */
    private createItem(): void {
        let token = this.authorization.user.token;
        let currentContext = this.contextProvider.context;
        this.processing = true;
        this.setMetadataValues();
        // First, create the item
        this.dspaceService.createItem(this.item.sanitize(), token, currentContext.id).subscribe(response => {
            // If successful
            if(response.status == 200) {
                this.item.id = JSON.parse(response.text()).id;
                // If we have files in our upload queue, upload them
                if (this.uploader.queue.length>0)
                {
                    // Upload all files
                    this.uploadAll(this.item, token).subscribe (response => {
                        // Finish up the item
                        this.finish(this.item.name, currentContext);
                    });
                }
                else {
                    this.finish(this.item.name, currentContext);
                }
            }
        },
        error => {
            console.error(error);
            this.processing = false;
            this.notificationService.notify('app', 'DANGER', this.translate.instant('item.create.error', { name: this.item.name }));
        });
    }

    /**
     * Return whether we have a type input and are using type-based forms
     * @return true if type input, false otherwise
     */
    private hasTypeInput(): boolean {
        return this.typeInput ? true : false;
    }

    /**
     * When a new type is selected, re-run init() to reinitialize the form
     * based on the selected type value.
     */
    private typeSelected($event): void {
        this.init();
    }

    /**
     * Upload all files in queue, returning an Observable which will not complete
     * until all files in queue have been fully uploaded.
     * @param item
     *      Item to upload files into
     * @param token
     *      Authentication token
     */
    private uploadAll(item: Item, token:string): Observable<boolean> {
        // Return an observer which waits for all uploads to complete
        return Observable.create(observer => {
            // Create a custom FileUploader.onCompleteAll() callback which completes
            // our observer once it is triggered.
            this.uploader.onCompleteAll = () => {
                observer.next(true);
                observer.complete();
            }

            // Save the item and authToken to our custom uploader
            // so they can be used in the upload process
            this.uploader.item = item;
            this.uploader.authToken = token;

            // Then, start the upload of all items!
            this.uploader.uploadAll();
        })
    }

}
