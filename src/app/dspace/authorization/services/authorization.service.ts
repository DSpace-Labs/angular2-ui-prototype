import {Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

import {User} from '../../models/user.model';

import {DSpaceService} from '../../services/dspace.service';

/**
 *
 */
@Injectable()
export class AuthorizationService {

	private _user: User;

	private userSubject : Subject<User>;

    userObservable: Observable<User>;

	/**
     *
     */
    constructor(private dspace: DSpaceService) {
		this.userSubject = new Subject<User>();
        this.userObservable = this.userSubject.asObservable();
        let email = localStorage.getItem('email');
        let token = localStorage.getItem('token');
        if(email && token) {
        	this.user = new User(email, token);
        }
    }

    /**
     *
     */
    login(email: string, password: string): Observable<Response> {

    	let observableResponse: Observable<Response> = this.dspace.login(email, password);
    	
    	observableResponse.subscribe(response => {           
            if(response.status == 200) {
                let token = response.text();
                this.user = new User(email, token);
                localStorage.setItem('email', email);
                localStorage.setItem('token', token);
            }
        },
        error => {
            
        });

        return observableResponse;
    }

    /**
     *
     */
    logout(): void {
    	this.user = null;
    	localStorage.removeItem('email');
        localStorage.removeItem('token');
    }

    /**
     *
     */
    set user(user: User) {
    	this._user = user;
    	this.userSubject.next(this._user);
    }

    /**
     *
     */
    get user(): User {
    	return this._user;
    }

}
