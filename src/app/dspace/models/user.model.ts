
/**
 * A model class for a User.
 */
export class User {

	/**
	 *
	 */
    private _email: string;
    
    /**
     *
     */
    private _token: string;

    /**
     *
     */
    constructor(email: string, token: string) {
    	this.email = email;
    	this.token = token;
    }

    /**
     *
     */
    set email(email: string) {
    	this._email = email;
    }

    /**
     *
     */
    get email(): string {
    	return this._email;
    }

    /**
     *
     */
    set token(token: string) {
    	this._token = token;
    }

    /**
     *
     */
    get token(): string {
    	return this._token;
    }

}