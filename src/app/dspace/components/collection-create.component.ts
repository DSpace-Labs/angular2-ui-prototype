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

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../authorization/services/authorization.service';
import { ContextProviderService } from '../services/context-provider.service';
import { DSpaceService } from '../services/dspace.service';
import { DSpaceDirectory } from '../dspace.directory';
import { FormService } from '../../utilities/form/form.service';

import { AbstractCreateComponent } from '../../utilities/form/abstract-create.component';
import { FormFieldsetComponent } from '../../utilities/form/form-fieldset.component';

import { Collection } from "../models/collection.model";
import { FormInput } from '../../utilities/form/form-input.model';

/**
 * 
 */
@Component({
    selector: 'collection-create',
    pipes: [ TranslatePipe ],
    directives: [ FormFieldsetComponent ],
    template: ` 
                <h3>Create Collection</h3><hr>
                <form *ngIf="active" [ngFormModel]="form" (ngSubmit)="createCollection()" novalidate>
                    <form-fieldset [form]="form" [inputs]="inputs"></form-fieldset>
                    <div class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="reset()">Reset</button>
                        <button type="submit" class="btn btn-primary btn-sm" [disabled]="!form.valid">Submit</button>
                    </div>
                </form>
              `
})
export class CollectionCreateComponent extends AbstractCreateComponent {

    /**
     * Collection being created. ngModel
     */
    private collection: Collection;

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
        this.collection = new Collection();
        this.formService.getForm('collection').subscribe(inputs => {
            this.inputs = inputs;
            let formControls = {};
            for(let input of this.inputs) {
                input.value = input.default ? input.default : '';
                let validators = this.createValidators(input);
                formControls[input.id] = new Control('', Validators.compose(validators));
            }
            this.form = this.builder.group(formControls);
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
                this.collection[input.key] = input.value;
            }
        }
    }

    /**
     * Resets the form.
     */
    reset(): void {
        this.creating = false;
        this.active = false;
        this.init();
    }

    /**
     * Create collection.
     */
    private createCollection(): void {
        this.creating = true;
        let token = this.authorization.user.token;
        let currentContext = this.contextProvider.context;
        this.setModelValues();
        this.dspaceService.createCollection(this.collection, token, currentContext.id).subscribe(response => {
            if(response.status == 200) {
                this.reset();
                this.dspace.refresh(currentContext);
                this.router.navigate(['/Communities', { id: currentContext.id }]);
            }
        },
        error => {
            this.reset();
            console.log(error);
        });

    }

}
