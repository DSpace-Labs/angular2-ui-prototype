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
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';
import { NotificationService } from '../../utilities/notification/notification.service';
import { DSpaceService } from '../services/dspace.service';
import { DSpaceHierarchyService } from '../services/dspace-hierarchy.service';

import { FormSecureComponent } from '../../utilities/form/form-secure.component';
import { FormFieldsetComponent } from '../../utilities/form/form-fieldset.component';
import { LoaderComponent } from '../../utilities/loader.component';

import { FormInput } from '../../utilities/form/form-input.model';
import { Metadatum } from '../models/metadatum.model';

/**
 * Login form. Uses form-modal component.
 */
@Component({
    selector: 'inline-edit',
    directives: [ FormFieldsetComponent, LoaderComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <loader *ngIf="processing" [center]="false"></loader>
                <form *ngIf="showForm()" [ngFormModel]="form" (ngSubmit)="update()" novalidate>
                    
                    <span *ngIf="show()" class="{{class}}">{{ model[property] }}</span>

                    <span *ngIf="edit()" class="{{class}}">

                        <span *ngIf="selectable()">{{ model[property] }} <span class="glyphicon glyphicon-pencil clickable" (click)="select()"></span></span>

                        <form-fieldset *ngIf="selected" [form]="form" [inputs]="inputs" [label]="false" (onEvent)="execute($event)"></form-fieldset>

                    </span>

                </form>
              `
})
export class InlineEditComponent extends FormSecureComponent implements AfterContentInit, OnDestroy {

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

    /**
     *
     */
    private key: string;

    /**
     *
     */
    constructor(private translate: TranslateService,
                private contextProvider: ContextProviderService,
                private notificationService: NotificationService,
                private dspaceService: DSpaceService,
                private dspaceHierarchy: DSpaceHierarchyService,
                private breadcrumbService: BreadcrumbService,
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
        
        console.log(this.model);
        
        this.inputs = new Array<FormInput>();
        
        this.files = new Array<any>();
        
        this.subscriptions = new Array<any>();

        let form = 'item';

        this.key = this.model.key ? this.model.key : this.property;
        
        switch(this.model.type) {

            case 'item': {

                let fsub1 = this.formService.getForm(form).subscribe(inputs => {
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

                this.subscriptions.push(fsub1);


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

            default: {
                
            }

        }
        
        let fsub2 = this.formService.getForm(form).subscribe(inputs => {
            
            let formControls = {};
            for(let input of inputs) {

                if(input.key == this.key) {

                    input.value = this.model[this.property];
                    
                    console.log(input)
                    
                    this.inputs.push(input);
                    
                    // this is a temporary easy way to allow modification of metadata
                    // if it was part of the types create form
                    if(this.model.key != 'dc.title') {
                        this.model.editable = true;
                    }

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

        this.subscriptions.push(fsub2);

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
        // probably can just select 0 of array
        for(let input of this.inputs) {
            if(input.value) {
                this.model[this.property] = input.value;
            }
        }
    }

    /**
     * 
     */
    private update(event?: any): void {
        // check if selected to avoid update onBlur when form submitted or edit canceled
        if(this.selected) {
            
            this.selected = false;
            
            let token = this.authorization.user.token;
            
            let currentContext = this.contextProvider.context;
    
            this.processing = true;
    
            this.setModelValues();
    
            let metadatum = new Metadatum({
                key: this.key,
                value: this.model[this.property],
                language: this.model.language ? this.model.language : null
            });
    
            let metadata = new Array<Metadatum>();
    
            metadata.push(metadatum);
    
            this.dspaceService.updateItemMetadata(metadata, token, currentContext.id).subscribe(response => {
    
                if(response.status == 200) {
                    // If we have files in our upload queue, upload them
                    // if (this.uploader.queue.length > 0)
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
    }
    
    /**
     * cancel the update
     */
    cancel(): void {
        this.selected = false;
        // probably can just select 0 of array
        for(let input of this.inputs) {
            if(input.value) {
                input.value = this.model[this.property];
            }
        }
    }
    
    /**
     * Refresh the form and context, navigate to origin context, and add notification.
     * @param itemName name of item being created
     * @param currentContext reference to current location/context
     */
    finish(name: string, currentContext: any): void {
        this.dspaceHierarchy.refresh(currentContext);
        this.breadcrumbService.update(currentContext);
        this.reset();        
        // this alert is to distracting for inline edit
        //this.notificationService.notify('item', 'SUCCESS', this.translate.instant('update.success', { name: name }), 10);
    }
    
    /**
     * 
     */
    execute(action): void {
        this[action]();
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
    editing(): boolean {
        return this.model ? this.contextProvider.editing : false;
    }

    /**
     *
     */
    show(): boolean {
        return !this.editing() || !this.allowed();
    }

    /**
     *
     */
    edit(): boolean {
        return this.editing() && this.allowed();
    }
    
    /**
     *
     */
    selectable(): boolean {
        return !this.selected && this.allowed();
    }
    
    /**
     *
     */
    allowed(): boolean {
        return this.inputs ? this.inputs.length > 0 : false;
    }

}