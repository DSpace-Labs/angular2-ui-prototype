import { 
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { FORM_DIRECTIVES, ControlGroup } from '@angular/common';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { FormValidationMessageComponent } from '../../utilities/form/form-validation-message.component';

import { FormInput } from '../../utilities/form/form-input.model';

/**
 * Form modal. ng-content brings in the actual form.
 */
@Component({
    selector: 'item-metadata-input',
    pipes: [ TranslatePipe ],
    directives: [ FORM_DIRECTIVES, FormValidationMessageComponent ],
    template: `
                <hr>
                <label>Metadata</label>
                <table class="table table-striped">
                    <tbody>
                        <tr *ngFor="let input of metadatumInputs">
                            <td>
                                <div class="row">
                                    <div class="col-md-11 col-xs-10">
                                        <label>{{ input.gloss }}</label>
                                        <span class="text-danger" *ngIf="required(input)">*required</span>
                                        <label class="pull-right">{{ input.key }}</label>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-11 col-xs-10">
                                        <fieldset class="form-group" [class.has-error]="hasError(input)">
                                            <input *ngIf="checkboxInput(input)" type="checkbox" name="{{ input.id }}" id="{{ input.id }}" value="true" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                                            <input *ngIf="textInput(input)" class="form-control" type="text" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                                            <input *ngIf="dateInput(input)" class="form-control" type="date" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                                            <textarea *ngIf="textAreaInput(input)" class="form-control" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]"></textarea>
                                            <select *ngIf="selectInput(input)" class="form-control" id="{{ input.id }}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                                                <option *ngFor="let option of input.options" [value]="option.value">{{ option.gloss }}</option>
                                            </select>
                                            <form-validation-message [form]="form" [input]="input"></form-validation-message>
                                        </fieldset>
                                    </div>
                                    <div class="col-xs-1" *ngIf="input.repeatable">
                                        <span *ngIf="!repeat(input)" class="glyphicon glyphicon-plus clickable" aria-hidden="true" (click)="addMetadatumInput(input)"></span>
                                        <span *ngIf="repeat(input)" class="glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeMetadatumInput(input)"></span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
              `
})
export class ItemMetadataInputComponent {

    /**
     * The forms control group.
     */
    @Input("form") private form: ControlGroup;

    /**
     * Item input fields.
     */
    @Input("metadatumInputs") private metadatumInputs: Array<FormInput>;

    /**
     * 
     */
    @Output('addMetadatumInputEmitter') addMetadatumInputEmitter: EventEmitter<FormInput> = new EventEmitter<FormInput>();
  
    /**
     * 
     */
    @Output('removeMetadatumInputEmitter') removeMetadatumInputEmitter: EventEmitter<FormInput> = new EventEmitter<FormInput>();

    /**
     * 
     */
    private addMetadatumInput(input: FormInput): void {
        this.addMetadatumInputEmitter.next(input);
    }

    /**
     * 
     */
    private removeMetadatumInput(input: FormInput): void {
        this.removeMetadatumInputEmitter.next(input);
    }

    /**
     *
     */
    private required(input: FormInput): boolean {
        return input.validation.required && input.validation.required.value;
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

    /**
     *
     */
    private repeat(input: FormInput): boolean {
      return input.repeat ? true : false;
    }

}
