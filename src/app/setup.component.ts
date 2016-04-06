import {Component} from 'angular2/core';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * 
 */
@Component({
    selector: 'setup',
    pipes: [TranslatePipe],
    template: `
                <div class="container">
                    <h2>{{'setup.title' | translate}}</h2>
                </div>
              `
})
export class SetupComponent {

    constructor(translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

}