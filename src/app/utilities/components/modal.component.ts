import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 *
 */
@Component({
    selector: 'modal',
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
            				        		<h4 class="modal-title">{{title}}</h4>
            				      		</div>

            					      	<div class="modal-body">
            					        	<ng-content></ng-content>
            					      	</div>

                              <div class="modal-footer">
            					        	<button type="button" class="btn btn-default btn-sm" (click)="cancelAction()">{{cancelLabel}}</button>
            					        	<button type="submit" class="btn btn-primary btn-sm" (click)="confirmAction()" [disabled]="!valid">{{confirmLabel}}</button>
            					      	</div>

                          </form>

        					    </div>
        				  	</div>
        				</div>
              `
})
export class Modal implements OnInit {

    /**
     *
     */
	  @Input('title') title: string;
    
    /**
     *
     */
  	@Input('cancel-label') cancelLabel: string = 'Cancel';
  	
    /**
     *
     */
    @Input('confirm-label') confirmLabel: string = 'Confirm';

    /**
     *
     */
    @Input('valid') valid: string;

    /**
     *
     */
  	@Output('action') actionEmitter: EventEmitter<ModalAction> = new EventEmitter<ModalAction>();
  
    /**
     *
     */
  	@Output('loaded') loadedEmitter: EventEmitter<Modal> = new EventEmitter<Modal>();

    /**
     *
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
     *
     */
  	hide(): void {
  		  this.showModal = false;
  	}

    /**
     *
     */
  	confirmAction(): void {
    	this.actionEmitter.next(ModalAction.CONFIRM);
  	}

    /**
     *
     */
  	cancelAction(): void {
    	this.actionEmitter.next(ModalAction.CANCEL);
    	this.hide();
  	}

}

/**
 * 
 */
export enum ModalAction { CONFIRM, CANCEL }
