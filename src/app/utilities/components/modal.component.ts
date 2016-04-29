import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    selector: 'modal',
    pipes: [TranslatePipe],
    template: `
                <div class="modal-backdrop fade in" [style.display]="showModal ? 'block' : 'none'"></div>
				<div class="modal" tabindex="-1" role="dialog" style="display: block" [style.display]="showModal ? 'block' : 'none'">
				  	<div class="modal-dialog">
				    	<div class="modal-content">
				      		<div class="modal-header">
				        		<button type="button" class="close" aria-label="Close" (click)="cancelAction()">
				          			<span aria-hidden="true">&times;</span>
				        		</button>
				        		<h4 class="modal-title">{{title}}</h4>
				      		</div>
					      	<div class="modal-body">
					        	<ng-content></ng-content>
					      	</div>
					      	<div class="modal-footer">
					        	<button type="button" class="btn btn-default btn-sm" (click)="cancelAction()" [disabled]="!validated">{{cancelLabel}}</button>
					        	<button type="button" class="btn btn-primary btn-sm" (click)="positiveAction()">{{positiveLabel}}</button>
					      	</div>
					    </div>
				  	</div>
				</div>
              `
})
export class Modal implements OnInit {

	@Input('title') title: string;
  	@Input('cancel-label') cancelLabel: string = 'Cancel';
  	@Input('positive-label') positiveLabel: string = 'OK';

  	@Input('validated') validated: boolean = false;

  	@Output('action') actionEmitter: EventEmitter<ModalAction> = new EventEmitter<ModalAction>();
  
  	@Output('loaded') loadedEmitter: EventEmitter<Modal> = new EventEmitter<Modal>();

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

    ngOnInit() {
    	this.loadedEmitter.next(this);
  	}

  	/**
   	 * Shows the modal. There is no method for hiding. This is done using actions of the modal itself.
   	 */
  	show() {
  	  	this.showModal = true;
  	}

  	hide() {
  		this.showModal = false;
  	}

  	positiveAction() {
    	this.actionEmitter.next(ModalAction.CONFIRM);
  	}

  	cancelAction() {
    	this.actionEmitter.next(ModalAction.CANCEL);
    	this.hide();
  	}

}

/**
 * The possible reasons a modal has been closed.
 */
export enum ModalAction { CONFIRM, CANCEL }
