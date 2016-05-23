import { Component, OnDestroy } from '@angular/core';
import { RouteParams, Router } from '@angular/router-deprecated';
import { AuthorizationService } from '../authorization/services/authorization.service';


/**
 * This component is just used to log out the user.
 */
@Component({
    template:``
})
export class LogoutComponent{


    /**
     * Just redirect the user after loging the user out.
     */
    constructor(private authorization : AuthorizationService, private router : Router)
    {
        authorization.logout();
        router.navigate(["Dashboard"]);
    }

}
