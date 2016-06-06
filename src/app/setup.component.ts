import { Component } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { BreadcrumbService } from './navigation/services/breadcrumb.service';

import { Breadcrumb } from './navigation/models/breadcrumb.model';

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
     */
    constructor(private breadcrumbService: BreadcrumbService) {
        breadcrumbService.visit(new Breadcrumb('setup', true));
    }

}
