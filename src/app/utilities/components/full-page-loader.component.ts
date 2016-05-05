import { Component } from 'angular2/core';

/**
 * 
 */
@Component({
    selector: 'full-page-loader',
    template: `
                <div class="modal-backdrop fade in"></div>
            	<img src="./static/images/full-page-loading.gif" alt="Loading" class="full-page-loader">
              `
})
export class FullPageLoaderComponent {

}
