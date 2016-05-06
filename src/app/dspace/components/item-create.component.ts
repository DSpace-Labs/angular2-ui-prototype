import { Component } from 'angular2/core';
import { Router } from 'angular2/router';

import {
    FORM_DIRECTIVES,
    FORM_BINDINGS,
    ControlGroup,
    Control,
    FormBuilder,
    NgForm,
    Validators
} from 'angular2/common';

import { Observable } from 'rxjs/Rx';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../authorization/services/authorization.service';
import { ContextProviderService } from '../services/context-provider.service';
import { DSpaceService } from '../services/dspace.service';
import { DSpaceDirectory } from '../dspace.directory';
import { FormService } from '../../utilities/form/form.service';

import { AbstractCreateComponent } from '../../utilities/form/abstract-create.component';
import { FormFieldsetComponent } from '../../utilities/form/form-fieldset.component';
import { FullPageLoaderComponent } from '../../utilities/form/full-page-loader.component';
import { ItemBitstreamAddComponent } from './item-bitstream-add.component';
import { ItemMetadataInputComponent } from './item-metadata-input.component';

import { Bitstream } from '../models/bitstream.model';
import { FormInput } from '../../utilities/form/form-input.model';
import { Item } from "../models/item.model";
import { Metadatum } from '../models/metadatum.model';

/**
 * 
 */
@Component({
    selector: 'item-create',
    pipes: [ TranslatePipe ],
    bindings: [ FORM_BINDINGS ],
    directives: [ FORM_DIRECTIVES,
                  FullPageLoaderComponent,
                  FormFieldsetComponent,
                  ItemBitstreamAddComponent,
                  ItemMetadataInputComponent ],
    template: ` 
                <full-page-loader *ngIf="creating"></full-page-loader>
                <form *ngIf="active" [ngFormModel]="form" (ngSubmit)="createItem()" novalidate>
                    <form-fieldset [form]="form" [inputs]="inputs"></form-fieldset>
                    <item-bitstream-add [files]="files" 
                                        (addBitstreamEmitter)="addBitstream($event)"
                                        (removeBitstreamEmitter)="removeBitstream($event)">
                    </item-bitstream-add>
                    <item-metadata-input [form]="form" [metadatumInputs]="metadatumInputs"
                                         (addMetadatumInputEmitter)="addMetadatumInput($event)"
                                         (removeMetadatumInputEmitter)="removeMetadatumInput($event)">
                    </item-metadata-input>
                    <div class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="reset()">Reset</button>
                        <button type="submit" class="btn btn-primary btn-sm" [disabled]="!form.valid">Submit</button>
                    </div>

                </form>
              `
})
export class ItemCreateComponent extends AbstractCreateComponent {

    /**
     * Metadata input fields.
     */
    private metadatumInputs: Array<FormInput>;

    /**
     * Bitstreams.
     */
    private files: Array<any>;

    /**
     * Item being created. ngModel
     */
    private item: Item;

    /**
     *
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     * @param dspaceService
     *      DSpaceService is a singleton service to interact with the dspace service.
     * @param formService
     *      FormService is a singleton service to retrieve form data.
     * @param dspace
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param translate
     *      TranslateService
     * @param builder
     *      FormBuilder is a singleton service provided by Angular2.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(private authorization: AuthorizationService,
                private contextProvider: ContextProviderService,
                private dspaceService: DSpaceService,
                private formService: FormService,
                private dspace: DSpaceDirectory,
                private translate: TranslateService,
                private builder: FormBuilder,
                private router: Router) {
        super();
        translate.setDefaultLang('en');
        translate.use('en');
        this.init();
    }

    /**
     * Initialize the form and validators.
     */
    init(): void {
        this.item = new Item();
        this.files = new Array<any>();
        Observable.forkJoin([
            this.formService.getForm('item'), 
            this.formService.getForm('item-metadata')
        ]).subscribe(inputs => {

            this.inputs = inputs[0];
            let formControls = {};
            for(let input of this.inputs) {
                input.value = input.default ? input.default : '';
                let validators = this.createValidators(input);
                formControls[input.id] = new Control('', Validators.compose(validators));
            }
            this.form = this.builder.group(formControls);

            this.metadatumInputs = inputs[1];
            for(let input of this.metadatumInputs) {
                input.value = input.default ? input.default : '';
                let validators = this.createValidators(input);
                this.form.addControl(input.id, new Control('', Validators.compose(validators)));
            }

            this.active = true;
        },
        errors => {
            console.log(errors);
        });
    }

    /**
     *
     */
    setModelValues(): void {
        for(let input of this.inputs) {
            if(input.value) {
                this.item[input.key] = input.value;
            }
        }
    }

    /**
     *
     */
    setMetadataValues(): void {
        for(let input of this.metadatumInputs) {
            if(input.value) {
                this.item.metadata.push(new Metadatum(input));
            }
        }
    }

    /**
     * Reset the form.
     */
    reset(): void {
        this.creating = false;
        this.active = false;
        this.init();
    }

    /**
     * 
     */
    private addBitstream(event: any): void {
        var files = event.srcElement ? event.srcElement.files : event.target.files;
        for(let file of files) {
            this.files.push(file);
        }
    }
    
    /**
     * 
     */
    private removeBitstream(file: any): void {
        for(let i = this.files.length - 1; i >= 0; i--) {
            if(this.files[i].name == file.name) {
                this.files.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 
     */
    private addMetadatumInput(input: FormInput): void {
        for(let i = this.metadatumInputs.length - 1; i >= 0; i--) {
            if(this.metadatumInputs[i].key == input.key) {
                let clonedInput = this.cloneInput(this.metadatumInputs[i]);
                let validators = this.createValidators(clonedInput);
                this.metadatumInputs.splice(i+1, 0, clonedInput);
                this.form.addControl(clonedInput.id, new Control('', Validators.compose(validators)));
                break;
            }
        }
    }

    /**
     * 
     */
    private removeMetadatumInput(input: FormInput): void {
        this.form.removeControl(input.id);
        for(let i = this.metadatumInputs.length - 1; i >= 0; i--) {
            if(this.metadatumInputs[i].key == input.key) {
                this.metadatumInputs.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 
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
        this.creating = true;
        let token = this.authorization.user.token;
        let currentContext = this.contextProvider.context;
        this.item.metadata = new Array<Metadatum>();
        this.setModelValues();
        this.setMetadataValues();
        this.dspaceService.createItem(this.item, token, currentContext.id).subscribe(response => {
            if(response.status == 200) {                
                this.item.id = JSON.parse(response.text()).id;

                let bitStreamObservables = new Array<any>();
                for(let file of this.files) {
                    bitStreamObservables.push(this.dspaceService.addBitstream(this.item, file, token));
                }

                Observable.forkJoin(bitStreamObservables).subscribe(bitstreamResponses => {
                    this.reset();
                    this.dspace.refresh(currentContext);
                    this.router.navigate(['/Collections', { id: currentContext.id }]);
                },
                errors => {
                    console.log(errors);
                    this.reset();
                    this.dspace.refresh(currentContext);
                    this.router.navigate(['/Collections', { id: currentContext.id }]);
                });
            }
        },
        error => {
            this.reset();
            console.log(error);
        });
    }

}
