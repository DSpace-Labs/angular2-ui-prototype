import { Component } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { FormBuilder, NgForm } from '@angular/common';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../services/authorization.service';
import { FormService } from '../../../utilities/form/form.service';

import { FormFieldsetComponent } from '../../../utilities/form/form-fieldset.component';
import { FormModalComponent, ModalAction } from '../../../utilities/form/form-modal.component';
import { LoginComponent } from './login.component';

/**
 * Login form. Uses form-modal component.
 */
@Component({
  	selector: 'login-modal',
  	directives: [ FormFieldsetComponent, FormModalComponent ],
  	pipes: [ TranslatePipe ],
  	template: `
                <form-modal *ngIf="active" 
                    [form]="form"
                    [title]="'login.title'"
                    [cancelLabel]="'login.cancel'"
                    [confirmLabel]="'login.confirm'"
                    [disabled]="disabled()"
                    (loadedEmitter)="onLoaded($event)"
                    (actionEmitter)="onAction($event)">
                    <form-fieldset [form]="form" [inputs]="inputs"></form-fieldset>
                    <span *ngIf="unauthorized" class="validaiton-helper text-danger">
                        {{ 'login.unauthorized' | translate }}
                    </span>
                </form-modal>
              `
})
export class LoginModalComponent extends LoginComponent {

    /**
     * Actual FormModal used to show and hide modal.
     */
    private login: FormModalComponent;

    /**
     *
     * @param formService
     *      FormService is a singleton service to retrieve form data.
     * @param builder
     *      FormBuilder is a singleton service provided by Angular2.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(formService: FormService,
                builder: FormBuilder,
                authorization: AuthorizationService,
                router: Router) {
        super(formService, builder, authorization, router);
        this.init();
    }

    /**
     * Callback to assign modal after being loaded.
     *
     * @param modal
     *      FormModal
     */
    onLoaded(modal: FormModalComponent): void {
        this.login = modal;
    }

    /**
     * Callback to invoke chosen action.
     *
     * @param action
     *      ModalAction of chosen action, CONFIRM or CANCEL
     */
    onAction(action: ModalAction): void {
        if(action == ModalAction.CONFIRM) {
            this.processing = true;
            this.setModelValues();
            this.authorization.login(this.email, this.password).subscribe(response => {
                if(response.status == 200) {
                    let token = response.text();
                    this.authorization.status(token).subscribe(response => {
                        this.login.hide();
                        this.login.finished();
                        this.reset();
                    },
                    error => {
                        this.processing = false;
                        this.unauthorized = true;
                        this.login.finished();
                    });
                }
            },
            error => {
                this.processing = false;
                this.unauthorized = true;
                this.login.finished();
            });
        }
        else if(action == ModalAction.CANCEL) {
            this.reset();
        }
    }

    /**
     * Opens the modal.
     */
    private openLoginModal(): void {
        this.login.show();
    }

}