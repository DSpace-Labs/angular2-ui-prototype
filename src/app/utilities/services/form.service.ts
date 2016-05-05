import { Injectable } from 'angular2/core';
import { Observable } from "rxjs/Observable";

import { HttpService } from './http.service';
import { URLHelper } from "../url.helper";

import { MetadatumInput } from '../../dspace/models/metadatum-input.model';

 /**
 * 
 */
@Injectable()
export class FormService {

    /**
     * @param httpService 
     *      HttpService is a singleton service to provide basic xhr requests.
     */
    constructor(private httpService: HttpService) {}

    /**
     * Get the metadata input form json.
     */
    getItemMetadataForm(): Observable<Array<MetadatumInput>> {
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteUIURL('/static/forms/item-metadata.json')
        }).map(json => {
            let metadataInputs = new Array<MetadatumInput>();
            for(let metadataInput of json) {
                metadataInputs.push(new MetadatumInput(metadataInput));
            }
            return metadataInputs;
        });
    }

}
