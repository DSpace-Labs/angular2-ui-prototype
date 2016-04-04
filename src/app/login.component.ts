import {Component} from 'angular2/core';
import {NgClass, NgForm} from 'angular2/common';

/**
 * 
 */
@Component({
    selector: 'login',
    template: `
                <div class="container">
                    <h2>Login</h2>
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

}