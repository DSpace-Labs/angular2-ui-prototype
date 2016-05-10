import { OnActivate, ComponentInstruction, Router } from '@angular/router-deprecated';

import { FormBuilder } from '@angular/common';

import { AuthorizationService } from '../../dspace/authorization/services/authorization.service';
import { FormService } from './form.service';

import { FormComponent } from './form.component';

/**
 *
 */
export class FormSecureComponent extends FormComponent implements OnActivate {

    /**
     *
     * @param formService
     *      FormService is a singleton service to retrieve form data.
     * @param builder
     *      FormBuilder is a singleton service provided by Angular2.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(formService: FormService,
                builder: FormBuilder,
                authorization: AuthorizationService,
                router: Router) {
        super(formService, builder, authorization, router);
    }
    
    /**
     *
     */
    routerOnActivate(next: ComponentInstruction, prev: ComponentInstruction) {
        if (!this.authorization.isAuthenticated()) {
            this.router.navigate(['/Login']);
        }
    }

}
