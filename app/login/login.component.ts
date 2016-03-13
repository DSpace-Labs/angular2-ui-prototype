import {Component, View} from 'angular2/core';
import {NgClass, NgForm} from 'angular2/common';

import {LoginService} from './login.service'

@Component({
    selector: 'login'
})
@View({
    template: `
                    <div class="login fade in" [ngClass]="{in: showing}">
                        <form class="form-inline" (ngSubmit)="onSubmit()">
                            <div class="form-group">
                                <label class="sr-only" for="login-email">Email address</label>
                                <input [(ngModel)]="email" type="email" class="form-control" id="login-email" placeholder="Enter email" (keyup)="typing($event)" autofocus>
                            </div>
                            <div class="form-group">
                                <label class="sr-only" for="login-password">Password</label>
                                <input [(ngModel)]="password" type="password" class="form-control" id="login-password" placeholder="Password">
                            </div>  
                            <button type="submit" class="btn btn-primary">Sign in</button>
                            <button class="btn btn-warning" (click)="onCancel()">Cancel</button>
                        </form>
                    </div>
                  `
})
export class LoginComponent {

    // toggles login div
    showing: boolean;

    timer: number;

    email: string;
    password: string;

    constructor(private loginService: LoginService) {
        this.showing = false;
    }

    ngAfterViewInit() {
        this.loginService.emitter.subscribe((showing) => {
            this.showing = true;
            this.tick();
        });
    }

    reset() {
        console.log('Reset');
        this.showing = false;
        this.email = "";
        this.password = "";
        clearTimeout(this.timer);
    }

    onSubmit() {
        console.log('Login');
        this.loginService.login(this.email, this.password);
        this.reset();
    }

    onCancel() {
        this.reset();
    }

    tick() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            console.log('Timeout');
            this.reset();            
        }, 15000);
    }

    typing(event) {
        this.tick();
        console.log(event);
    }

}