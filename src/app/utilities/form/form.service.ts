import { Injectable } from 'angular2/core';
import { Observable } from "rxjs/Observable";

import { HttpService } from '../services/http.service';
import { URLHelper } from "../url.helper";

import { FormInput } from './form-input.model';

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
    getForm(form: string): Observable<Array<FormInput>> {
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteUIURL('/static/forms/' + form + '.json')
        }).map(json => {
            let inputs = new Array<FormInput>();
            for(let input of json) {
                inputs.push(new FormInput(input));
            }
            return inputs;
        });
    }

}
