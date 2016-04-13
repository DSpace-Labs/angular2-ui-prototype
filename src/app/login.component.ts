import {Component} from 'angular2/core';
import {NgClass, NgForm} from 'angular2/common';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * 
 */
@Component({
    selector: 'login',
    pipes: [TranslatePipe],
    template: `
                <div class="container">
                    <h2>{{'login.title' | translate}} </h2>
                </div>
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

    constructor(translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

}