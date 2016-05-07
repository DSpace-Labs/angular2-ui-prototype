import { Component, Input } from 'angular2/core';

import { FORM_DIRECTIVES, ControlGroup } from 'angular2/common';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { ValidationMessageComponent } from './validation-message.component';

import { FormInput } from './form-input.model';

/**
 * Form modal. ng-content brings in the actual form.
 */
@Component({
    selector: 'form-fieldset',
    pipes: [ TranslatePipe ],
    directives: [ FORM_DIRECTIVES, ValidationMessageComponent ],
    template: `
                <fieldset class="form-group" *ngFor="let input of inputs" [class.has-error]="hasError(input)">
                    <input *ngIf="checkboxInput(input)" type="checkbox" name="{{ input.id }}" id="{{ input.id }}" value="true" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                    <label for="input.id">{{ input.gloss }}</label>
                    <input *ngIf="textInput(input)" class="form-control" type="text" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                    <input *ngIf="passwordInput(input)" class="form-control" type="password" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                    <input *ngIf="dateInput(input)" class="form-control" type="date" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                    <textarea *ngIf="textAreaInput(input)" class="form-control" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]"></textarea>
                    <select *ngIf="selectInput(input)" class="form-control" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
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

    /**
     *
     */
    private hasError(input: FormInput): boolean {
        return !this.form.controls[input.id].valid && !this.form.controls[input.id].pristine;
    }

    /**
     *
     */
    private checkboxInput(input: FormInput): boolean {
        return input.type == 'CHECKBOX';
    }

    /**
     *
     */
    private textInput(input: FormInput): boolean {
        return input.type == 'TEXT';
    }
    
    /**
     *
     */
    private passwordInput(input: FormInput): boolean {
        return input.type == 'PASSWORD';
    }

    /**
     *
     */
    private dateInput(input: FormInput): boolean {
        return input.type == 'DATE';
    }

    /**
     *
     */
    private textAreaInput(input: FormInput): boolean {
        return input.type == 'TEXTAREA';
    }

    /**
     *
     */
    private selectInput(input: FormInput): boolean {
        return input.type == 'SELECT';
    }

}
