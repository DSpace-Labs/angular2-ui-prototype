import { Injectable } from 'angular2/core';

/**
 * 
 */
@Injectable()
export class StorageService {

    /**
     *
     */
    store(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    /**
     *
     */
    load(key: string): string {
        return localStorage.getItem(key);
    }

    /**
     *
     */
    remove(key: string): void {
        localStorage.removeItem(key);
    }

}
