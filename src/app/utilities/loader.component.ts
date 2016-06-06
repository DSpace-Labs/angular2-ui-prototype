import { Component, Input } from '@angular/core';

/**
 * 
 */
@Component({
    selector: 'loader',
    template: `
                <div [class.loader-center]="center">
                    <div *ngIf="message" class="loader-message">
                    	<label>{{ message }}</label>
                    </div>
                	<div class="loader-gif">
                        <img src="./static/images/loading.gif" alt="Loading">
                    </div>
                <div>
              `
})
export class LoaderComponent {

    /**
     * 
     */
	@Input("message") private message: string;
    
    /**
     * 
     */
    @Input("center") private center: boolean = true;
    
}
