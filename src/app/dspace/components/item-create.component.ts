import {Component} from 'angular2/core';

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceService} from '../services/dspace.service';

@Component({
    selector: 'item-create',
    pipes: [TranslatePipe],
    template: ` 
                CREATE ITEM
              `
})
export class ItemCreateComponent {

	/**
     *
     * @param dspace
     *      DSpaceService is a singleton service to interact with the dspace service.
     * @param translate
     *      TranslateService
     */
    constructor(private dspace: DSpaceService, 
    			private translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

}

                       
