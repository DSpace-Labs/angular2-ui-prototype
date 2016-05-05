import { Component, Input } from 'angular2/core';

import { FORM_DIRECTIVES, ControlGroup } from 'angular2/common';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { ValidationMessageComponent } from './validation-message.component';

import { FormInput } from '../models/form-input.model';

/**
 * Form modal. ng-content brings in the actual form.
 */
@Component({
    selector: 'form-fieldset',
    pipes: [TranslatePipe],
    directives: [FORM_DIRECTIVES,
    			 ValidationMessageComponent],
    template: `
                <fieldset class="form-group" *ngFor="let input of inputs" [class.has-error]="!form.controls[input.id].valid && !form.controls[input.id].pristine">

                    <input *ngIf="input.type == 'CHECKBOX'" type="checkbox" name="{{input.id}}" id="{{input.id}}" value="true" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">

                    <label for="input.id">{{input.gloss}}</label>
                    
                    <input *ngIf="input.type == 'TEXT'" class="form-control" type="text" id="{{input.id}}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">

                    <input *ngIf="input.type == 'DATE'" class="form-control" type="date" id="{{input.id}}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">

                    <textarea *ngIf="input.type == 'TEXTAREA'" class="form-control" id="{{input.id}}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]"></textarea>

                    <select *ngIf="input.type == 'SELECT'" class="form-control" id="{{input.id}}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                        <option *ngFor="let option of input.options" [value]="option.value">{{ option.gloss }}</option>
                    </select>
                    
                    <validation-message [form]="form" [input]="input"></validation-message>

                </fieldset>
              `
})
export class FormFieldsetComponent {

	/**
     * The forms control group.
     */
    @Input("form") private form: ControlGroup;

    /**
     * Item input fields.
     */
    @Input("inputs") private inputs: Array<FormInput>;

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
