import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */

@Component({
    selector: 'item-authors',
    inputs: ['metadataObject'],
    template:
            `<div id="authors">
                    <h2>authors.....</h2>
                    <h3>test: {{metadataObject}}</h3>
             </div>
            `
})

export class AuthorsComponent {

    /**
     * An object that represents the current item.
     *
     * TODO: replace object with inheritance model. e.g. item extends dspaceObject
     */


    item: Object;
    public metadataObject : String;

    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {

    }

}

