import {Component} from 'angular2/core';
import {NgClass, NgForm} from 'angular2/common';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {BreadcrumbService} from './navigation/services/breadcrumb.service';

/**
 * 
 */
@Component({
    selector: 'login',
    pipes: [TranslatePipe],
    template: `
                
              `
})
export class LoginComponent {

    /**
     * 
     */
    email: string;

    /**
     * 
     */
    password: string;

    /**
     *
     * @param translate
     *      TranslateService
     */
    constructor(private breadcrumb: BreadcrumbService,
                private translate: TranslateService) {
        breadcrumb.visit({
            name: 'Login',
            type: 'login',
            component: '/Login',
            root: true,
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}