import { Component, Input } from 'angular2/core';

import { FORM_DIRECTIVES, ControlGroup } from 'angular2/common';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { FormInput } from '../models/form-input.model';

/**
 * Form modal. ng-content brings in the actual form.
 */
@Component({
    selector: 'validation-message',
    pipes: [TranslatePipe],
    directives: [FORM_DIRECTIVES],
    template: `
                <div *ngIf="form.controls[input.id]">
                    <span [hidden]="form.controls[input.id].valid || form.controls[input.id].pristine" class="validaiton-helper text-danger">
                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.minlength">
                            must have at least {{ input.validation.minLength }} characters
                        </span>
                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.maxlength">
                            must have at most {{ input.validation.maxLength }} characters
                        </span>
                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.pattern">
                            invalid format
                        </span>
                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.required">
                            required
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

}
