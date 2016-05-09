import { Injectable } from 'angular2/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/**
 *
 */
@Injectable()
export class ContextProviderService {

    /**
     *
     */
    private _context: any = null;

    /**
     *
     */
    private contextSubject : Subject<any>;

    /**
     *
     */
    contextObservable: Observable<any>;

    /**
     *
     */
    constructor() {
        this.contextSubject = new Subject<any>();
        this.contextObservable = this.contextSubject.asObservable();
    }

    /**
     *
     */
    get context(): any {
        return this._context;
    }

    /**
     *
     */
    set context(context: any) {
        this._context = context;
        this.contextSubject.next(this._context);
    }

}