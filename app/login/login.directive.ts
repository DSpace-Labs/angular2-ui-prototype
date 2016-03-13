import {Directive, Input} from 'angular2/core';

import {LoginService} from './login.service'

@Directive({
    selector: '[loginClick]',
    host: {
        '(click)': 'onMouseClick()'
    }
})
export class LoginDirective {
            
    constructor(private loginService: LoginService) { }

    onMouseClick() {
        this.loginService.show();
    }
    
}