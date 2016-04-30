import {Injectable, Inject} from 'angular2/core';
import {Response} from 'angular2/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

import {User} from '../../models/user.model';

import {DSpaceService} from '../../services/dspace.service';
import {StorageService} from '../../../utilities/services/storage.service';

/**
 *
 */
@Injectable()
export class AuthorizationService {

    /**
     *
     */
	private _user: User;

    /**
     *
     */
	private userSubject : Subject<User>;

    /**
     *
     */
    userObservable: Observable<User>;

	/**
     *
     */
    constructor(@Inject(StorageService) private storageService: StorageService,
                private dspace: DSpaceService) {
		this.userSubject = new Subject<User>();
        this.userObservable = this.userSubject.asObservable();
        
        {
            let email = storageService.load('email');
            let token = storageService.load('token');
            if(email && token) {
                this.user = new User(email, token);
            }
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

                {
                	this.storageService.store('email', email);
                	this.storageService.store('token', token);
            	}
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
    	
    	{
    		this.storageService.remove('email');
        	this.storageService.remove('token');
    	}
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
