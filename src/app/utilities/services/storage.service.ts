import { Injectable } from '@angular/core';

/**
 * 
 */
@Injectable()
export class StorageService {

    // TODO: add ability to select between sessionStorage and localStorage
    //       localStorage can be used to preserve user and token when remember me is selected
    //       sessionStorage will delete the session variables when the browser is closed 
    
    /**
     *
     */
    store(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }

    /**
     *
     */
    load(key: string): string {
        return sessionStorage.getItem(key);
    }

    /**
     *
     */
    remove(key: string): void {
        sessionStorage.removeItem(key);
    }

}
