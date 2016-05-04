import {Component} from 'angular2/core';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {BreadcrumbService} from '../../../navigation/services/breadcrumb.service';

/**
 * 
 */
@Component({
    selector: 'register',
    pipes: [TranslatePipe],
    template: `
                <span>{{'register.title' | translate}}</span>
              `
})
export class RegistrationComponent {

    /**
     *
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param translate
     *      TranslateService
     */
    constructor(private breadcrumb: BreadcrumbService,
                private translate: TranslateService) {
        breadcrumb.visit({
            name: 'Register',
            type: 'register',
            component: '/Register',
            root: true,
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}
