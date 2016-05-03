import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {NgForm} from 'angular2/common';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {AuthorizationService} from '../authorization/services/authorization.service';
import {ContextProviderService} from '../services/context-provider.service';
import {DSpaceService} from '../services/dspace.service';
import {DSpaceDirectory} from '../dspace.directory';
import {Item} from "../models/item.model";

import {MetadatumInput} from '../models/metadatum-input.model';
import {Metadatum} from '../models/metadatum.model';

@Component({
    selector: 'item-create',
    pipes: [TranslatePipe],
    template: ` 
                <form *ngIf="active" #createItemForm="ngForm" (ngSubmit)="createItem()" novalidate>
                    
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

                    <fieldset class="form-group">
                       
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>
                                        <div class="row">
                                            
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngIf="metadataInputs" *ngFor="#input of metadatumInputs">
                                    <td>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <label>{{input.gloss}}</label>
                                                <label class="pull-right">{{input.key}}</label>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-12">

                                                <input *ngIf="input.type == 'TEXT'" class="form-control" type="text" id="{{input.key}}" [(ngModel)]="input.value" #value="ngForm" value="{{input.default}}">

                                                <input *ngIf="input.type == 'DATE'" class="form-control" type="date" id="{{input.key}}" [(ngModel)]="input.value" #value="ngForm">

                                                <textarea *ngIf="input.type == 'TEXTAREA'" class="form-control" id="{{input.key}}" [(ngModel)]="input.value" #value="ngForm"></textarea>

                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </fieldset>


                    <div class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="reset()">Reset</button>
                        <button type="submit" class="btn btn-primary btn-sm" [disabled]="!name.valid">Submit</button>
                    </div>

                </form>
              `
})
export class ItemCreateComponent {

    private active: boolean = true;

    private item: Item = new Item();

    private metadatumInputs: Array<MetadatumInput>;

    constructor(private authorization: AuthorizationService,
                private contextProvider: ContextProviderService,
                private dspaceService: DSpaceService,
                private dspace: DSpaceDirectory, 
                private translate: TranslateService,
                private router: Router) {
        translate.setDefaultLang('en');
        translate.use('en');

        dspaceService.getItemMetadataForm().subscribe((metadatumInputs:Array<MetadatumInput>) => {
            this.metadatumInputs = metadatumInputs;
        });

    }

    createItem(): void {

        let token = this.authorization.user.token;
        
        let currentContext = this.contextProvider.context;

        for(let input of this.metadatumInputs) {
            if(input.value) {
                this.item.metadata.push(new Metadatum(input));
            }
        }

        this.dspaceService.createItem(this.item, token, currentContext.id).subscribe(response => {
            if(response.status == 200) {

                this.reset();

                this.dspace.refresh(currentContext);
                this.router.navigate(['/Collections', { id: currentContext.id }]);

            }
        },
        error => {
            console.log(error);
        });

    }

    reset(): void {
        this.item = new Item();
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }

}

                       
