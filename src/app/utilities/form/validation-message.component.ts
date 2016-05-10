import { Component, Input } from '@angular/core';

import { FORM_DIRECTIVES, ControlGroup } from '@angular/common';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { FormInput } from './form-input.model';

/**
 * Form modal. ng-content brings in the actual form.
 */
@Component({
    selector: 'validation-message',
    pipes: [ TranslatePipe ],
    directives: [ FORM_DIRECTIVES ],
    template: `
                <div *ngIf="form.controls[input.id]">
                    <span [hidden]="hideValidationMessage()" class="validaiton-helper text-danger">
                        <span *ngIf="minLengthError()">
                            {{ input.validation.minLength.message | translate }}
                        </span>
                        <span *ngIf="maxLengthError()">
                            {{ input.validation.maxLength.message | translate }}
                        </span>
                        <span *ngIf="patternError()">
                            {{ input.validation.pattern.message | translate }}
                        </span>
                        <span *ngIf="requiredError()">
                            {{ input.validation.required.message | translate }}
                        </span>
                    </span>
                </div>
              `
})
export class ValidationMessageComponent {

    /**
     * The forms control group.
     */
    @Input("form") private form: ControlGroup;

    /**
     * Item input fields.
     */
    @Input("input") private input: FormInput;

    /**
     *
     * @param translate
     *      TranslateService
     */
    constructor(private translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

    /**
     *
     */
    private hideValidationMessage(): boolean {
        return this.form.controls[this.input.id].valid || this.form.controls[this.input.id].pristine;
    }

    /**
     *
     */
    private minLengthError(): boolean {
        return this.form.controls[this.input.id].errors && this.form.controls[this.input.id].errors['minlength'];
    }

    /**
     *
     */
    private maxLengthError(): boolean {
        return this.form.controls[this.input.id].errors && this.form.controls[this.input.id].errors['maxlength'];
    }

    /**
     *
     */
    private patternError(): boolean {
        return this.form.controls[this.input.id].errors && this.form.controls[this.input.id].errors['pattern'];
    }

    /**
     *
     */
    private requiredError(): boolean {
        return this.form.controls[this.input.id].errors && this.form.controls[this.input.id].errors['required'];
    }

}
