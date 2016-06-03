import { Component, Input, AfterContentInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import {
    FORM_DIRECTIVES,
    FORM_BINDINGS,
    ControlGroup,
    Control,
    FormBuilder,
    NgForm,
    Validators
} from '@angular/common';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../authorization/services/authorization.service';
import { ContextProviderService } from '../services/context-provider.service';
import { FormService } from '../../utilities/form/form.service';
import { NotificationService } from '../../utilities/notification/notification.service';
import { DSpaceService } from '../services/dspace.service';

import { FormSecureComponent } from '../../utilities/form/form-secure.component';
import { FormFieldsetComponent } from '../../utilities/form/form-fieldset.component';

import { FormInput } from '../../utilities/form/form-input.model';
import { Metadatum } from '../models/metadatum.model';

/**
 * Login form. Uses form-modal component.
 */
@Component({
    selector: 'inline-edit',
    directives: [ FormFieldsetComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <form *ngIf="showForm()" [ngFormModel]="form" (ngSubmit)="update()" novalidate>
                    
                    <h1 *ngIf="showH1()" class="{{class}}">{{ model[property] }}</h1>
                    <h1 *ngIf="editH1()" class="{{class}}">

                        <span *ngIf="!selected">{{ model[property] }} <span class="glyphicon glyphicon-pencil clickable" (click)="select()"></span></span>

                        <form-fieldset *ngIf="selected" [form]="form" [inputs]="inputs" [label]="false"></form-fieldset>

                    </h1>

                </form>
              `
})
export class InlineEditComponent extends FormSecureComponent implements AfterContentInit, OnDestroy {

    /**
     *
     */
    @Input() type: string;

    /**
     *
     */
    @Input() class: string;

    /**
     *
     */
    @Input() model: any;

    /**
     *
     */
    @Input() property: string;

    /**
     *
     */
    private selected: boolean = false;

    /**
     * Bitstreams.
     */
    private files: Array<any>;

    /**
     *
     */
    private subscriptions: Array<any>;

    private key: string;

    /**
     *
     */
    constructor(private translate: TranslateService,
                private contextProvider: ContextProviderService,
                private notificationService: NotificationService,
                private dspaceService: DSpaceService,
                formService: FormService,
                builder: FormBuilder,
                authorization: AuthorizationService,
                router: Router) {
        super(formService, builder, authorization, router);
    }

    /**
     *
     */
    ngAfterContentInit() {
        this.init();
    }

    /**
     * Initialize the item metadata form and validators.
     */
    init(): void {

        this.inputs = new Array<FormInput>();
        this.files = new Array<any>();
        this.subscriptions = new Array<any>();

        let form = 'item';

        this.key = this.property;

        switch(this.model.type) {

            case 'item': {

                let subscription = this.formService.getForm(form).subscribe(inputs => {
                    let value;
                    this.model.metadata.forEach(metadatum => {
                        if(metadatum.key == 'dc.type') {
                            value = metadatum.value;
                        }
                    });
                    for(let i in inputs) {
                        if(inputs[i].key == 'dc.type') {
                            for(let o in inputs[i].options) {
                                if(inputs[i].options[o].value == value) {
                                    form = inputs[i].options[o].form;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                },
                errors => {
                    console.error('Error: ' + errors);
                });

                this.subscriptions.push(subscription);


                if(this.property == 'name') {
                    this.key = 'dc.title';
                }

            } break;

            case 'collection': {
                form = 'collection';
            } break;

            case 'community': {
                form = 'community';
            } break;

        }


        this.files = new Array<any>();

        let subscription = this.formService.getForm(form).subscribe(inputs => {
            
            let formControls = {};
            for(let input of inputs) {

                if(input.key == this.key) {

                    input.value = this.model[this.property];

                    this.inputs.push(input);

                    let validators = this.formService.createValidators(input);
                    formControls[input.id] = new Control('', Validators.compose(validators));
                    break;
                }
            }

            this.form = this.builder.group(formControls);

            this.active = true;
        },
        errors => {
            console.error('Error: ' + errors);
        });

        this.subscriptions.push(subscription);

    }

    /**
     *
     */
    select(): void {
        this.selected = true;
    }


    /**
     * Sets the community values with ngModel values from inputs.
     */
    setModelValues(): void {
        for(let input of this.inputs) {
            if(input.value) {
                this.model[this.property] = input.value;
            }
        }
    }


    /**
     * Create item. First creates the item through request and then joins multiple requests for bitstreams.
     */
    private update(): void {
        let token = this.authorization.user.token;
        let currentContext = this.contextProvider.context;
        this.processing = true;

        console.log('update')

        console.log(this.model)

        this.setModelValues();

        let metadatum = new Metadatum({
            key: this.key,
            value: this.model[this.property]
        });

        let metadata = new Array<Metadatum>();

        metadata.push(metadatum);


        // First, create the item
        this.dspaceService.updateItemMetadata(metadata, token, currentContext.id).subscribe(response => {
            // If successful
            if(response.status == 200) {
                console.log('success')
                
                console.log(response)

                //this.model.id = JSON.parse(response.text()).id;
                // If we have files in our upload queue, upload them
                // if (this.uploader.queue.length>0)
                // {
                //     // Upload all files
                //     this.uploadAll(this.item, token).subscribe (response => {
                //         // Finish up the item
                //         this.finish(this.item.name, currentContext);
                //     });
                // }
                // else {
                //     this.finish(this.model['name'], currentContext);
                // }
                this.finish(this.model['name'], currentContext);
            }
        },
        error => {
            console.error(error);
            this.processing = false;
            this.notificationService.notify('item', 'DANGER', this.translate.instant('update.error', { name: name }));
        });
        
    }


    /**
     * Refresh the form and context, navigate to origin context, and add notification.
     * @param itemName name of item being created
     * @param currentContext reference to current location/context
     */
    finish(name: string, currentContext: any): void {
        this.reset();
        this.selected = false;
        this.notificationService.notify('item', 'SUCCESS', this.translate.instant('update.success', { name: name }), 10);
    }


    /**
     *
     */
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }



    /**
     *
     */
    isEditing(): boolean {
        return this.model ? this.model['editing'] : false;
    }

    /**
     *
     */
    showH1(): boolean {
        return this.type == 'h1' && !this.isEditing();
    }

    /**
     *
     */
    editH1(): boolean {
        return this.type == 'h1' && this.isEditing();
    }

}