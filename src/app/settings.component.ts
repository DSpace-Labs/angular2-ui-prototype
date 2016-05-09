import { Component } from 'angular2/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { BreadcrumbService } from './navigation/services/breadcrumb.service';

import { Breadcrumb } from './navigation/models/breadcrumb.model';

/**
 * 
 */
@Component({
    selector: 'settings',
    pipes: [ TranslatePipe ],
    template: `
                <span>{{ 'settings.title' | translate }}</span>
              `
})
export class SettingsComponent {

    private breadcrumb: Breadcrumb = new Breadcrumb('settings', true);

    /**
     *
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     */
    constructor(private breadcrumbService: BreadcrumbService) {
        breadcrumbService.visit(this.breadcrumb);
    }

}
