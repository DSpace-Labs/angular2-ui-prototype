import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * Form modal. ng-content brings in the actual form.
 */
@Component({
    selector: 'form-modal',
    pipes: [TranslatePipe],
    template: `
                <div class="modal-backdrop fade in" [style.display]="showModal ? 'block' : 'none'"></div>
				<div class="modal" tabindex="-1" role="dialog" style="display: block" [style.display]="showModal ? 'block' : 'none'">
				  	<div class="modal-dialog">
				    	<div class="modal-content">

                            <form class="modal-form" #modalForm="ngForm" (ngSubmit)="confirmAction()" novalidate>

                                <div class="modal-header">
    				        		<button type="button" class="close" aria-label="Close" (click)="cancelAction()">
    				          			<span aria-hidden="true">&times;</span>
    				        		</button>
    				        		<h4 class="modal-title">{{title | translate}}</h4>
    				      		</div>

    					      	<div class="modal-body">
    					        	<ng-content></ng-content>
    					      	</div>

                                <div class="modal-footer">
    					        	<button type="button" class="btn btn-default btn-sm" (click)="cancelAction()">{{cancelLabel | translate}}</button>
    					        	<button type="submit" class="btn btn-primary btn-sm" (click)="confirmAction()" [disabled]="!valid">{{confirmLabel | translate}}</button>
    					      	</div>

                            </form>

					    </div>
				  	</div>
				</div>
              `
})
export class FormModal implements OnInit {

    /**
     * Modal title.
     */
    @Input('title') title: string;
    
    /**
     * Modal cancel label gloss.
     */
  	@Input('cancel-label') cancelLabel: string = 'Cancel';
  	
    /**
     * Modal confirm label gloss.
     */
    @Input('confirm-label') confirmLabel: string = 'Confirm';

    /**
     * Wether inputs are valid. Enables confirm action.
     */
    @Input('valid') valid: boolean;

    /**
     * EventEmitter used to emit the chosen action.
     */
  	@Output('action') actionEmitter: EventEmitter<ModalAction> = new EventEmitter<ModalAction>();
  
    /**
     * EventEmitter used to emit when the modal has been loaded.
     */
  	@Output('loaded') loadedEmitter: EventEmitter<FormModal> = new EventEmitter<FormModal>();

    /**
     * Whether the modal is being displayed or not.
     */
  	private showModal: boolean = false;

    /**
     *
     * @param translate
     *      TranslateService
     */
    constructor(private translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

    /**
     *
     */
    ngOnInit() {
    	 this.loadedEmitter.next(this);
  	}

  	/**
   	 * Shows the modal.
   	 */
  	show(): void {
  	  	this.showModal = true;
  	}

    /**
     * Hides the modal.
     */
  	hide(): void {
	   this.showModal = false;
  	}

    /**
     * Emit confirm action.
     */
  	confirmAction(): void {
    	this.actionEmitter.next(ModalAction.CONFIRM);
  	}

    /**
     * Emit cancel action.
     */
  	cancelAction(): void {
    	this.actionEmitter.next(ModalAction.CANCEL);
    	this.hide();
  	}

}

/**
 * ModalAction enum. 
 * TODO: Move to own file.
 */
export enum ModalAction { CONFIRM, CANCEL }
