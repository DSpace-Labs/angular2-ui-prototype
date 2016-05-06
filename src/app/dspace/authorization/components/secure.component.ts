import { Component } from 'angular2/core';
import { OnActivate, ComponentInstruction, Router } from 'angular2/router';

import { AuthorizationService } from '../services/authorization.service';

/**
 *
 */
export class SecureComponent implements OnActivate {

	authorization: AuthorizationService;

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
 		console.log('secure component')
 	}

 	/**
 	 *
 	 */
 	routerOnActivate(next: ComponentInstruction, prev: ComponentInstruction) {
 		console.log('secure routing')
		if (!this.authorization.isAuthenticated()) {
			console.log('goto login')
			this.router.navigate(['/Login']);
		}
	}

}