import { 
	Component,
	EventEmitter,
	Input,
	Output
} from 'angular2/core';

import { FORM_DIRECTIVES, ControlGroup } from 'angular2/common';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { ValidationMessageComponent } from '../../utilities/components/validation-message.component';

import { FormInput } from '../../utilities/models/form-input.model';

/**
 * Form modal. ng-content brings in the actual form.
 */
@Component({
    selector: 'item-metadata-input',
    pipes: [TranslatePipe],
    directives: [FORM_DIRECTIVES,
    			 ValidationMessageComponent],
    template: `
                <hr>
                <label>Metadata</label>
                <table class="table table-striped">
                    <tbody>
                        <tr *ngFor="let input of metadatumInputs">
                            <td>

                                <div class="row">
                                    <div class="col-md-11 col-xs-10">
                                        <label>{{input.gloss}}</label>
                                        <span class="text-danger" *ngIf="input.validation.required">*required</span>
                                        <label class="pull-right">{{input.key}}</label>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-11 col-xs-10">

                                        <fieldset class="form-group" [class.has-error]="!form.controls[input.id].valid && !form.controls[input.id].pristine">

                                            <input *ngIf="input.type == 'CHECKBOX'" type="checkbox" name="{{input.id}}" id="{{input.id}}" value="true" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">

                                            <input *ngIf="input.type == 'TEXT'" class="form-control" type="text" id="{{input.id}}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">

                                            <input *ngIf="input.type == 'DATE'" class="form-control" type="date" id="{{input.id}}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">

                                            <textarea *ngIf="input.type == 'TEXTAREA'" class="form-control" id="{{input.id}}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]"></textarea>

                                            <select *ngIf="input.type == 'SELECT'" class="form-control" id="{{input.id}}" [(ngModel)]="input.value" [ngFormControl]="form.controls[input.id]">
                                                <option *ngFor="let option of input.options" [value]="option.value">{{ option.gloss }}</option>
                                            </select>
                                            
                                            <validation-message [form]="form" [input]="input"></validation-message>

                                        </fieldset>

                                    </div>

                                    <div class="col-xs-1" *ngIf="input.repeatable">
                                        <span *ngIf="!input.repeat" class="glyphicon glyphicon-plus clickable" aria-hidden="true" (click)="addMetadatumInput(input)"></span>
                                        <span *ngIf="input.repeat" class="glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeMetadatumInput(input)"></span>
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
    private addMetadatumInput(input: FormInput): void {
        this.addMetadatumInputEmitter.next(input);
    }

    /**
     * 
     */
    private removeMetadatumInput(input: FormInput): void {
        this.removeMetadatumInputEmitter.next(input);
    }

}
