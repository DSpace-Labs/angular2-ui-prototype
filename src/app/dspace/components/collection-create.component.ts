import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {NgForm} from 'angular2/common';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {AuthorizationService} from '../authorization/services/authorization.service';
import {ContextProviderService} from '../services/context-provider.service';
import {DSpaceService} from '../services/dspace.service';
import {DSpaceDirectory} from '../dspace.directory';
import {Collection} from "../models/collection.model";

@Component({
    selector: 'collection-create',
    pipes: [TranslatePipe],
    template: ` 
                <form *ngIf="active" #createCollectionForm="ngForm" (ngSubmit)="createCollection()" novalidate>
                    
                    <fieldset class="form-group" [class.has-error]="!name.valid && !name.pristine">
                        <label for="name">Name</label>
                        <input type="text" 
                               id="name" 
                               placeholder="Enter Collection Name" 
                               [(ngModel)]="collection.name"
                               #name="ngForm"
                               class="form-control"
                               minlength="4"
                               maxlength="64"
                               required>

                        <span [hidden]="name.valid || name.pristine" class="validaiton-helper">
                            <span *ngIf="name.errors && name.errors.minlength">
                                Collection name must have at least 4 characters
                            </span>
                            <span *ngIf="name.errors && name.errors.maxlength">
                                Collection name must have at most 64 characters
                            </span>
                            <span *ngIf="name.errors && name.errors.required">
                                Collection name required
                            </span>
                        </span>
                    </fieldset>

                    <div class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="reset()">Reset</button>
                        <button type="submit" class="btn btn-primary btn-sm" [disabled]="!name.valid">Submit</button>
                    </div>

                </form>
              `
})
export class CollectionCreateComponent {

    private active: boolean = true;

    private collection: Collection = new Collection();

    /**
     *
     * @param dspace
     *      DSpaceService is a singleton service to interact with the dspace service.
     * @param translate
     *      TranslateService
     */
    constructor(private authorization: AuthorizationService,
                private contextProvider: ContextProviderService,
                private dspaceService: DSpaceService,
                private dspace: DSpaceDirectory, 
                private translate: TranslateService,
                private router: Router) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

    createCollection(): void {

        let token = this.authorization.user.token;
        
        let currentContext = this.contextProvider.context;

        this.dspaceService.createCollection(this.collection, token, currentContext.id).subscribe(response => {
            if(response.status == 200) {
                this.reset();
                this.dspace.refresh(currentContext);
                this.router.navigate(['/Communities', { id: currentContext.id }]);

            }
        },
        error => {
            console.log(error);
        });

    }

    reset(): void {
        this.collection = new Collection();
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }

}

                       
