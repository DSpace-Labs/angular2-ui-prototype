import {Component} from 'angular2/core';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * 
 */
@Component({
    selector: 'register',
    pipes: [TranslatePipe],
    template: `
                <div class="container">
                    <h2>{{'register.title' | translate}}</h2>
                </div>
              `
})
export class RegisterComponent {


    constructor(translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

}