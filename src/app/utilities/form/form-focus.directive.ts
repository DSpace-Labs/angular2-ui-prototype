import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

/**
 * 
 */
@Directive({
    selector: '[focus]'
})
export class FormFocusDirective implements OnChanges {

    /**
     * 
     */
    @Input() focus: boolean;

    /**
     * 
     */
    constructor(private element: ElementRef) {}

    /**
     * 
     */
    ngOnChanges() {
        this.element.nativeElement.autofocus = this.focus;
    }

}