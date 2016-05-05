import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit
} from 'angular2/core';

import { NgForm } from 'angular2/common';
import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

/**
 * Form modal. ng-content brings in the actual form.
 */
@Component({
    selector: 'form-modal',
    pipes: [TranslatePipe],
    template: `
                <div class="modal-backdrop fade in" [style.display]="showModal ? 'block' : 'none'"></div>
                <div class="modal form-modal" tabindex="-1" role="dialog" [class.form-modal-fadein]="showModal">
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

                                <div class="form-loader">
                                    <img *ngIf="loading" src="./static/images/loading.gif" alt="Loading">
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
export class FormModalComponent implements OnInit {

    /**
     * Modal title.
     */
    @Input('title') title: string;
    
    /**
     * Modal cancel label gloss.
     */
    @Input('cancelLabel') cancelLabel: string = 'Cancel';

    /**
     * Modal confirm label gloss.
     */
    @Input('confirmLabel') confirmLabel: string = 'Confirm';

    /**
     * Wether inputs are valid. Enables confirm action.
     */
    @Input('valid') valid: boolean;

    /**
     * EventEmitter used to emit the chosen action.
     */
    @Output('actionEmitter') actionEmitter: EventEmitter<ModalAction> = new EventEmitter<ModalAction>();
  
    /**
     * EventEmitter used to emit when the modal has been loaded.
     */
    @Output('loadedEmitter') loadedEmitter: EventEmitter<FormModalComponent> = new EventEmitter<FormModalComponent>();

    /**
     * Indicates form is being processed.
     */
    private loading: boolean = false;

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
        this.loading = true;
        this.actionEmitter.next(ModalAction.CONFIRM);
    }

    /**
     * Emit cancel action.
     */
    cancelAction(): void {
        this.actionEmitter.next(ModalAction.CANCEL);
        this.hide();
    }

    /**
     * Form processing finished.
     */
    finished(): void {
        this.loading = false;
    }

}

/**
 * ModalAction enum. 
 * TODO: Move to own file.
 */
export enum ModalAction { CONFIRM, CANCEL }
