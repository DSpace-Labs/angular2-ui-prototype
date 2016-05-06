import { Component } from 'angular2/core';
import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { BreadcrumbService } from './navigation/services/breadcrumb.service';

/**
 * 
 */
@Component({
    selector: 'setup',
    pipes: [ TranslatePipe ],
    template: `
                <span>{{ 'setup.title' | translate }}</span>
              `
})
export class SetupComponent {

    /**
     *
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param translate
     *      TranslateService
     */
    constructor(private breadcrumbService: BreadcrumbService,
                private translate: TranslateService) {
        breadcrumbService.visit({
            name: 'Setup',
            type: 'setup',
            component: '/Setup',
            root: true,
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}
