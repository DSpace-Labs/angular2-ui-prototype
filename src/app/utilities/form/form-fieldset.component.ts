import { Component, Inject, Input } from '@angular/core';
import { ControlGroup } from '@angular/common';

import { FormValidationMessageComponent } from './form-validation-message.component';

import { FormInput } from './form-input.model';

import { FormFocusDirective } from './form-focus.directive';

/**
 * Form modal. ng-content brings in the actual form.
 */
@Component({
    selector: 'form-fieldset',
    directives: [ FormFocusDirective, FormValidationMessageComponent ],
    template: `
                <!-- Based on the *type* of field, display the appropriate input type (e.g. checkbox, text, date, textarea, etc) -->
                <!-- If input is hidden and is required make sure value is set -->
                <fieldset class="form-group" *ngFor="let input of inputs; let i = index" [hidden]="input.hidden" [class.has-error]="hasError(input)">
                    <input *ngIf="checkboxInput(input)" type="checkbox" name="{{ input.id }}" id="{{ input.id }}" value="true" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                    <!-- For accessibility, ensure label references input ID via "for" attribute -->
                    <label [attr.for]="input.id">{{ input.gloss }}</label>
                    <input *ngIf="textInput(input)" class="form-control" type="text" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]" [focus]="i == 0">
                    <input *ngIf="passwordInput(input)" class="form-control" type="password" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                    <input *ngIf="dateInput(input)" class="form-control" type="date" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                    <textarea *ngIf="textAreaInput(input)" class="form-control" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]"></textarea>
                    <select *ngIf="selectInput(input)" class="form-control" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                        <option *ngFor="let option of input.options" [value]="option.value">{{ option.gloss }}</option>
                    </select>
                    <form-validation-message [form]="form" [input]="input"></form-validation-message>
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
