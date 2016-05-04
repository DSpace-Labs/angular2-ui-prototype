import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {
    FORM_DIRECTIVES,
    FORM_BINDINGS,
    ControlGroup,
    Control,
    FormBuilder,
    NgForm,
    Validators
} from 'angular2/common';

import {Observable} from 'rxjs/Rx';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {AuthorizationService} from '../authorization/services/authorization.service';
import {ContextProviderService} from '../services/context-provider.service';
import {DSpaceService} from '../services/dspace.service';
import {DSpaceDirectory} from '../dspace.directory';

import {Item} from "../models/item.model";
import {Bitstream} from '../models/bitstream.model';
import {Metadatum} from '../models/metadatum.model';
import {MetadatumInput} from '../models/metadatum-input.model';

@Component({
    selector: 'item-create',
    pipes: [TranslatePipe],
    bindings: [FORM_BINDINGS],
    directives: [FORM_DIRECTIVES],
    template: ` 
                <form *ngIf="active" [ngFormModel]="form" (ngSubmit)="createItem()" novalidate>
                    
                    <fieldset class="form-group" [class.has-error]="!name.valid && !name.pristine">
                        <label for="name">Name</label>
                        <input class="form-control" type="text" id="name" placeholder="Enter Item Name" [(ngModel)]="item.name" #name="ngForm" minlength="4" maxlength="64" required>
                        <span [hidden]="name.valid || name.pristine" class="validaiton-helper">
                            <span *ngIf="name.errors && name.errors.minlength">
                                Item name must have at least 4 characters
                            </span>
                            <span *ngIf="name.errors && name.errors.maxlength">
                                Item name must have at most 64 characters
                            </span>
                            <span *ngIf="name.errors && name.errors.required">
                                Item name required
                            </span>
                        </span>
                    </fieldset>

                    <hr> <!-- TODO: attempt to move into seperate component, must be within form -->
                    <label>Bitstreams</label>
                    <fieldset class="form-group">
                        
                        <div class="row">
                            <div class="col-md-11 col-xs-10">
                                <span class="btn btn-primary btn-file">
                                    Add Bitstream <input type="file" (change)="addBitstream($event)"/>
                                </span>
                            </div>
                        </div>

                        <table class="table table-striped" *ngIf="files.length > 0">
                            <thead>
                                <tr>
                                    <td><label>File</label></td>
                                    <td><label>Description</label></td>
                                    <td><label>Remove</label></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let file of files">
                                    <td class="col-md-3 col-xs-2">
                                        <label class="space-top">{{file.name}}</label>
                                    </td>
                                    <td class="col-md-9 col-xs-8">
                                        <input class="form-control" type="text" id="{{file.name}}" [(ngModel)]="file.description">
                                    </td>
                                    <td class="col-xs-1 text-center">
                                        <span class="glyphicon glyphicon-remove clickable space-top" aria-hidden="true" (click)="removeBitstream(file)"></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </fieldset>

                    <hr> <!-- TODO: attempt to move into seperate component, must be within form -->
                    <label>Metadata</label>
                    <fieldset class="form-group">
                       
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

                                                <input *ngIf="input.type == 'TEXT'" class="form-control" type="text" id="{{input.id}}" [(ngModel)]="input.value" ngControl="{{input.id}}">

                                                <input *ngIf="input.type == 'DATE'" class="form-control" type="date" id="{{input.id}}" [(ngModel)]="input.value" ngControl="{{input.id}}">

                                                <textarea *ngIf="input.type == 'TEXTAREA'" class="form-control" id="{{input.id}}" [(ngModel)]="input.value" ngControl="{{input.id}}"></textarea>

                                                <select *ngIf="input.type == 'SELECT'" class="form-control" id="{{input.id}}" [(ngModel)]="input.value" ngControl="{{input.id}}">
                                                    <option *ngFor="let option of input.options" [value]="option.value">{{ option.gloss }}</option>
                                                </select>

                                                <div *ngIf="form.controls[input.id]">
                                                    <span [hidden]="form.controls[input.id].valid || form.controls[input.id].pristine" class="validaiton-helper text-danger">
                                                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.minlength">
                                                            must have at least {{ input.validation.minLength }} characters
                                                        </span>
                                                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.maxlength">
                                                            must have at most {{ input.validation.maxLength }} characters
                                                        </span>
                                                        <span *ngIf="form.controls[input.id].errors && form.controls[input.id].errors.required">
                                                            required
                                                        </span>
                                                    </span>
                                                </div>

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

                    </fieldset>

                    <div class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="reset()">Reset</button>
                        <button type="submit" class="btn btn-primary btn-sm" [disabled]="!name.valid || !form.valid">Submit</button>
                    </div>

                </form>
              `
})
export class ItemCreateComponent {

    private active: boolean = false;

    private item: Item;

    private files: Array<any>;

    private metadatumInputs: Array<MetadatumInput>;

    private form: ControlGroup;

    constructor(private authorization: AuthorizationService,
                private contextProvider: ContextProviderService,
                private dspaceService: DSpaceService,
                private dspace: DSpaceDirectory, 
                private translate: TranslateService,
                private builder: FormBuilder,
                private router: Router) {
        translate.setDefaultLang('en');
        translate.use('en');
        this.init();
    }

    init(): void {
        this.item = new Item();
        this.files = new Array<any>();
        this.dspaceService.getItemMetadataForm().subscribe((metadatumInputs:Array<MetadatumInput>) => {
            this.metadatumInputs = metadatumInputs;
            let formControls = {};
            for(let input of this.metadatumInputs) {
                input.value = input.default ? input.default : '';
                let validators = this.createValidators(input);
                formControls[input.id] = new Control('', Validators.compose(validators));
            }
            this.form = this.builder.group(formControls);
            this.active = true;
        });
    }

    addBitstream(event): void {
        var files = event.srcElement.files;
        for(let file of files) {
            this.files.push(file);
        }
    }
    
    removeBitstream(file): void {
        for(let i = this.files.length - 1; i > 0; i--) {
            if(this.files[i].name == file.name) {
                this.files.splice(i, 1);
                break;
            }
        }
    }

    addMetadatumInput(input: MetadatumInput): void {
        let clonedInput = this.cloneInput(input);
        let validators = this.createValidators(clonedInput);
        for(let i = this.metadatumInputs.length - 1; i > 0; i--) {
            if(this.metadatumInputs[i].key == clonedInput.key) {
                this.metadatumInputs.splice(i+1, 0, clonedInput);
                break;
            }
        }
        this.form.addControl(clonedInput.id, new Control('', Validators.compose(validators)));
    }

    removeMetadatumInput(input: MetadatumInput): void {
        this.form.removeControl(input.id);
        for(let i = this.metadatumInputs.length - 1; i > 0; i--) {
            if(this.metadatumInputs[i].key == input.key) {
                this.metadatumInputs.splice(i, 1);
                break;
            }
        }
    }

    cloneInput(input: MetadatumInput): MetadatumInput {
        let clonedInput = new MetadatumInput(JSON.parse(JSON.stringify(input)));
        clonedInput.repeat = clonedInput.repeat ? clonedInput.repeat++ : 1;
        clonedInput.value = '';
        if(clonedInput.validation.required) {
            clonedInput.validation.required = false;
        }
        return clonedInput;
    }

    createValidators(input: MetadatumInput): Array<any> {
        let validators: Array<any> = new Array<any>();
        for(let key in input.validation) {
            if(key == 'required') {
                if(input.validation[key]) {
                    validators.push(Validators.required);
                }
            }
            else {
                validators.push(Validators[key](input.validation[key]));
            }
        }
        return validators;
    }

    createItem(): void {
        let token = this.authorization.user.token;
        let currentContext = this.contextProvider.context;
        this.item.metadata = new Array<Metadatum>();
        for(let input of this.metadatumInputs) {
            if(input.value) {
                this.item.metadata.push(new Metadatum(input));
            }
        }
        this.dspaceService.createItem(this.item, token, currentContext.id).subscribe(response => {
            if(response.status == 200) {
                
                this.item.id = JSON.parse(response.text()).id;

                let bitStreamObservables = new Array<any>();
                for(let file of this.files) {
                    bitStreamObservables.push(this.dspaceService.addBitstream(this.item, file, token));
                }

                Observable.forkJoin(bitStreamObservables).subscribe(bitstreamResponses => {
                    this.reset();
                    this.dspace.refresh(currentContext);
                    this.router.navigate(['/Collections', { id: currentContext.id }]);
                },
                errors => {
                    console.log(errors);
                    this.reset();
                    this.dspace.refresh(currentContext);
                    this.router.navigate(['/Collections', { id: currentContext.id }]);
                });
            }
        },
        error => {
            console.log(error);
        });
    }

    reset(): void {
        this.active = false;
        this.init();
    }

}

                       
