import { Component } from 'angular2/core';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

/**
 * 
 */
@Component({
    selector: 'notification',
    pipes: [ TranslatePipe ],
    template: `
                
              `
})
export class FormFieldsetComponent {

    /**
     *
     * @param translate
     *      TranslateService
     */
    constructor(private translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

}
