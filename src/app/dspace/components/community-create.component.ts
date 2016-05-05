import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {NgForm} from 'angular2/common';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {AuthorizationService} from '../authorization/services/authorization.service';
import {ContextProviderService} from '../services/context-provider.service';
import {DSpaceService} from '../services/dspace.service';
import {DSpaceDirectory} from '../dspace.directory';
import {Community} from "../models/community.model";

/**
 * 
 */
@Component({
    selector: 'community-create',
    pipes: [TranslatePipe],
    template: ` 
                <form *ngIf="active" #createCommunityForm="ngForm" (ngSubmit)="createCommunity()" novalidate>
                    
                    <fieldset class="form-group" [class.has-error]="!name.valid && !name.pristine">
                        <label for="name">Name</label>
                        <input type="text" 
                               id="name" 
                               placeholder="Enter Community Name" 
                               [(ngModel)]="community.name"
                               #name="ngForm"
                               class="form-control"
                               minlength="4"
                               maxlength="64"
                               required>

                        <span [hidden]="name.valid || name.pristine" class="validaiton-helper">
                            <span *ngIf="name.errors && name.errors.minlength">
                                Community name must have at least 4 characters
                            </span>
                            <span *ngIf="name.errors && name.errors.maxlength">
                                Community name must have at most 64 characters
                            </span>
                            <span *ngIf="name.errors && name.errors.required">
                                Commnuity name required
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
export class CommunityCreateComponent {

    /**
     * Used to remove and add the form to reset validations. Suggested by Angular2 form examples.
     */
    private active: boolean = true;

    /**
     * Community being created. ngModel
     */
    private community: Community = new Community();

    /**
     *
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     * @param dspaceService
     *      DSpaceService is a singleton service to interact with the dspace service.
     * @param dspace
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param translate
     *      TranslateService
     * @param router
     *      Router is a singleton service provided by Angular2.
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

    /**
     * Create community.
     */
    private createCommunity(): void {
        let token = this.authorization.user.token;
        let currentContext = this.contextProvider.context;
        this.dspaceService.createCommunity(this.community, token, currentContext.id).subscribe(response => {
            if(response.status == 200) {
                this.reset();
                if(currentContext.root) {
                    this.dspace.refresh();
                    this.router.navigate(['/Dashboard']);
                }
                else {
                    this.dspace.refresh(currentContext);
                    this.router.navigate(['/Communities', { id: currentContext.id }]);
                }
            }
        },
        error => {
            console.log(error);
        });

    }

    /**
     * Reset form.
     */
    private reset(): void {
        this.community = new Community();
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }

}
