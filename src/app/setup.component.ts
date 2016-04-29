import {Component} from 'angular2/core';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {BreadcrumbService} from './navigation/services/breadcrumb.service';

/**
 * 
 */
@Component({
    selector: 'setup',
    pipes: [TranslatePipe],
    template: `
                <span>{{'setup.title' | translate}}</span>
              `
})
export class SetupComponent {

    /**
     *
     * @param translate
     *      TranslateService
     */
    constructor(private breadcrumb: BreadcrumbService,
                private translate: TranslateService) {
        breadcrumb.visit({
            name: 'Setup',
            type: 'setup',
            component: '/Setup',
            root: true,
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}