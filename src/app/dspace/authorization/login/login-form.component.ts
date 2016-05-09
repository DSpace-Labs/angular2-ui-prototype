import { Component } from 'angular2/core';
import { Router } from 'angular2/router';

import { FORM_DIRECTIVES, FormBuilder, NgForm } from 'angular2/common';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../services/authorization.service';
import { BreadcrumbService } from '../../../navigation/services/breadcrumb.service';
import { FormService } from '../../../utilities/form/form.service';

import { FormFieldsetComponent } from '../../../utilities/form/form-fieldset.component';
import { LoginComponent } from './login.component';

import { Breadcrumb } from '../../../navigation/models/breadcrumb.model';

/**
 * Login form component.
 */
@Component({
    selector: 'login-form',
    pipes: [ TranslatePipe ],
    directives: [ FORM_DIRECTIVES, FormFieldsetComponent ],
    template: `
                <form *ngIf="active" class="login-form" [ngFormModel]="form" (ngSubmit)="authenticate()" novalidate>
                    <form-fieldset [form]="form" [inputs]="inputs"></form-fieldset>
                    <span *ngIf="unauthorized" class="validaiton-helper text-danger">
                        {{ 'login.unauthorized' | translate }}
                    </span>
                    <div class="form-loader">
                        <img *ngIf="processing" src="./static/images/loading.gif" alt="Loading">
                    </div>
                    <span class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="cancel()">{{ 'login.cancel' | translate }}</button>
                        <button type="submit" class="btn btn-primary btn-sm" (click)="authenticate()" [disabled]="disabled()">{{ 'login.confirm' | translate }}</button>
                    </span>
                </form>
              `
})
export class LoginFormComponent extends LoginComponent {

    private breadcrumb: Breadcrumb = new Breadcrumb('login', true);

    /**
     *
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param translate
     *      TranslateService
     * @param formService
     *      FormService is a singleton service to retrieve form data.
     * @param builder
     *      FormBuilder is a singleton service provided by Angular2.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(private breadcrumbService: BreadcrumbService,
                private translate: TranslateService,
                formService: FormService,
                builder: FormBuilder,
                authorization: AuthorizationService,
                router: Router) {
        super(formService, builder, authorization, router);
        breadcrumbService.visit(this.breadcrumb);
        translate.setDefaultLang('en');
        translate.use('en');
        this.init();
    }
    
    /**
     * Get token and then call status to get fullname.
     */
    authenticate(): void {
        this.processing = true;
        this.setModelValues();
        this.authorization.login(this.email, this.password).subscribe(response => {
            if(response.status == 200) {
                let token = response.text();
                this.authorization.status(token).subscribe(response => {
                    this.router.navigate(['/Home']);
                },
                error => {
                    this.processing = false;
                    this.unauthorized = true;
                });
            }
        },
        error => {
            this.processing = false;
            this.unauthorized = true;
        });
    }

}
