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

import { TranslateService } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../authorization/services/authorization.service';
import { ContextProviderService } from '../services/context-provider.service';
import { DSpaceService } from '../services/dspace.service';
import { DSpaceDirectory } from '../dspace.directory';
import { FormService } from '../../utilities/form/form.service';
import { NotificationService } from '../../utilities/notification/notification.service';

import { FormFieldsetComponent } from '../../utilities/form/form-fieldset.component';
import { FormSecureComponent } from '../../utilities/form/form-secure.component';
import { FullPageLoaderComponent } from '../../utilities/full-page-loader.component';

import { Collection } from "../models/collection.model";
import { FormInput } from '../../utilities/form/form-input.model';

/**
 * 
 */
@Component({
    selector: 'collection-create',
    directives: [ FormFieldsetComponent, FullPageLoaderComponent ],
    template: ` 
                <h3>Create Collection</h3><hr>
                <full-page-loader *ngIf="processing"></full-page-loader>
                <form *ngIf="active" [ngFormModel]="form" (ngSubmit)="createCollection()" novalidate>
                    <form-fieldset [form]="form" [inputs]="inputs"></form-fieldset>
                    <div class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="reset()">Reset</button>
                        <button type="submit" class="btn btn-primary btn-sm" [disabled]="disabled()">Submit</button>
                    </div>
                </form>
              `
})
export class CollectionCreateComponent extends FormSecureComponent {

    /**
     * Collection being created. ngModel
     */
    private collection: Collection;

    /**
     *
     * @param translate
     *      TranslateService
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     * @param dspaceService
     *      DSpaceService is a singleton service to interact with the dspace service.
     * @param dspace
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
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
                private dspace: DSpaceDirectory,
                private notificationService: NotificationService,
                formService: FormService,
                builder: FormBuilder,
                authorization: AuthorizationService,
                router: Router) {
        super(formService, builder, authorization, router);
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
                let validators = this.formService.createValidators(input);
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
     * Sets the collection values with ngModel values from inputs.
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
        this.processing = false;
        this.active = false;
        this.init();
    }

    /**
     * Create collection.
     */
    private createCollection(): void {
        this.processing = true;
        let token = this.authorization.user.token;
        let currentContext = this.contextProvider.context;
        this.setModelValues();
        this.dspaceService.createCollection(this.collection, token, currentContext.id).subscribe(response => {
            if(response.status == 200) {
                this.finish(this.collection.name, currentContext);
            }
        },
        error => {
            this.notificationService.notify('app', 'DANGER', this.translate.instant('collection.create.error', { name: this.collection.name }));
            console.log(error);
        });
    }

    /**
     * Refresh the form and context, navigate to origin context, and add notification.
     */
    private finish(collectionName: string, currentContext: any): void {
        this.reset();
        this.dspace.refresh(currentContext);
        this.router.navigate(['/Communities', { id: currentContext.id }]);
        this.notificationService.notify('app', 'SUCCESS', this.translate.instant('collection.create.success', { name: collectionName }), 15);
    }

}
