import { Injectable } from '@angular/core';
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
    private _editing: boolean = false;

    /**
     *
     */
    private editingSubject : Subject<boolean>;

    /**
     *
     */
    editingObservable: Observable<boolean>;
    

    /**
     *
     */
    constructor() {
        this.contextSubject = new Subject<any>();
        this.contextObservable = this.contextSubject.asObservable();
        
        this.editingSubject = new Subject<boolean>();
        this.editingObservable = this.contextSubject.asObservable();
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
    
    /**
     *
     */
    get editing(): boolean {
        return this._editing;
    }

    /**
     *
     */
    set editing(editing: boolean) {
        this._editing = editing;
        this.editingSubject.next(this._editing);
    }

}