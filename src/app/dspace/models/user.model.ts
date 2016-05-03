
/**
 * A model class for a User.
 */
export class User {

    /**
     *
     */
     private _fullname: string;

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
    constructor(json: any) {
        this.fullname = json.fullname ? json.fullname : null;
    	this.email = json.email ? json.email : null;
    	this.token = json.token ? json.token : null;
    }

    /**
     *
     */
    set fullname(fullname: string) {
        this._fullname = fullname;
    }

    /**
     *
     */
    get fullname(): string {
        return this._fullname;
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