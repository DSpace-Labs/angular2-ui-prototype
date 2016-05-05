import { Injectable, Inject } from 'angular2/core';
import { Response } from 'angular2/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Observable";

import { User } from '../../models/user.model';

import { DSpaceService } from '../../services/dspace.service';
import { StorageService } from '../../../utilities/services/storage.service';

/**
 * Authorization service used for authentication and authorization.
 */
@Injectable()
export class AuthorizationService {

    /**
     * Current logged in user.
     */
    private _user: User;

    /**
     * User subject.
     */
    private userSubject : Subject<User>;

    /**
     * User observable.
     */
    userObservable: Observable<User>;

    /**
     * @param storageService
     *      StorageService is a singleton service to interact with the storage service.
     * @param dspace
     *      DSpaceService is a singleton service to interact with the dspace service.
     */
    constructor(@Inject(StorageService) private storageService: StorageService,
                private dspace: DSpaceService) {
        this.userSubject = new Subject<User>();
        this.userObservable = this.userSubject.asObservable();
        
        // {
        //     let fullname = storageService.load('fullname');
        //     let email = storageService.load('email');
        //     let token = storageService.load('token');
        //     if(fullname && email && token) {
        //         this.user = new User({
        //             fullname: fullname,
        //             email: email,
        //             token: token
        //         });
        //     }
        // }
        
    }

    /**
     * Login user with email and password.
     *
     * @param email
     *      User email.
     * @param password
     *      User password.
     */
    login(email: string, password: string): Observable<Response> {

        let loginResponse: Observable<Response> = this.dspace.login(email, password);
        
        loginResponse.subscribe(response => {
            if(response.status == 200) {
                
            }
        },
        error => {
            console.log(error);
        });

        return loginResponse;
    }

    status(token: string): Observable<Response> {

        let statusResponse: Observable<Response> = this.dspace.status(token);

        statusResponse.subscribe(response => {
            this.user = new User(response);

            // {
            //     this.storageService.store('fullname', this.user.fullname);
            //     this.storageService.store('email', this.user.email);
            //     this.storageService.store('token', this.user.token);
            // }

        },
        error => {
            console.log(error);
        });

        return statusResponse;
    }

    /**
     * Logout. Sets user to null. Perform other logout actions.
     */
    logout(): Observable<Response> {

        let token = this.user.token;

        let logoutResponse: Observable<Response> = this.dspace.logout(token);
        
        logoutResponse.subscribe(response => {
            if(response.status == 200) {
                this.user = null;

                // {
                //     this.storageService.remove('fullname');
                //     this.storageService.remove('email');
                //     this.storageService.remove('token');
                // }

            }
        },
        error => {
            console.log(error);
        });

        return logoutResponse;
    }

    /**
     * Sets the currently logged in user.
     *
     * @param user
     *      User whom is currently logged in.
     */
    set user(user: User) {
        this._user = user;
        this.userSubject.next(this._user);
    }

    /**
     * Returns the logged in user.
     */
    get user(): User {
        return this._user;
    }

}
