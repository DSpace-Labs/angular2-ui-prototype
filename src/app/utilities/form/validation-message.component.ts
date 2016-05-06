import { Component, Input } from 'angular2/core';

import { FORM_DIRECTIVES, ControlGroup } from 'angular2/common';

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
                    <span [hidden]="form.controls[input.id].valid || form.controls[input.id].pristine" class="validaiton-helper text-danger">
                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.minlength">
                            {{ input.validation.minLength.message | translate }}
                        </span>
                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.maxlength">
                            {{ input.validation.maxLength.message | translate }}
                        </span>
                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.pattern">
                            {{ input.validation.pattern.message | translate }}
                        </span>
                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.required">
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

}
