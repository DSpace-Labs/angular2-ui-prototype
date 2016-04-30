import {Component} from 'angular2/core';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {BreadcrumbService} from './navigation/services/breadcrumb.service';

/**
 * 
 */
@Component({
    selector: 'settings',
    pipes: [TranslatePipe],
    template: `
                <span>{{'settings.title' | translate}}</span>
              `
})
export class SettingsComponent {

    /**
     *
     * @param translate
     *      TranslateService
     */
    constructor(private breadcrumb: BreadcrumbService,
                private translate: TranslateService) {
        breadcrumb.visit({
            name: 'Settings',
            type: 'settings',
            component: '/Settings',
            root: true,
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}
