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
    
    enableEditMode(): void {
        this.editMode(true);    
    }
    
    disableEditMode(): void {
        this.editMode(false);    
    }
    
    private editMode(editing: boolean): void {
        if(editing) {
            this._context.editing = true;
        }
        else {
            delete this._context.editing;
        }
        console.log(this._context)
        this.contextSubject.next(this._context);
    }

}