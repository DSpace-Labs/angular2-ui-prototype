import { Component } from 'angular2/core';
import { OnActivate, ComponentInstruction, Router } from 'angular2/router';

import { AuthorizationService } from '../services/authorization.service';

/**
 *
 */
export class SecureComponent implements OnActivate {

    /**
     * singleton service to interact with the authorization service.
     */
	authorization: AuthorizationService;

    /**
     * singleton service provided by Angular2.
     */
	router: Router;

	/**
     *
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
 	constructor(authorization: AuthorizationService, router: Router) { 
 		this.authorization = authorization;
 		this.router = router;
 	}

 	/**
 	 *
 	 */
 	routerOnActivate(next: ComponentInstruction, prev: ComponentInstruction) {
		if (!this.authorization.isAuthenticated()) {
			this.router.navigate(['/Login']);
		}
	}

}