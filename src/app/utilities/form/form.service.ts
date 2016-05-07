import { Injectable } from 'angular2/core';
import { Validators } from 'angular2/common';

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
    
    /**
     *
     */
    createValidators(input: FormInput): Array<any> {
        let validators: Array<any> = new Array<any>();
        for(let key in input.validation) {
            if(key == 'required') {
                if(input.validation[key] && input.validation[key].value) {
                    validators.push(Validators.required);
                }
            }
            else {
                validators.push(Validators[key](input.validation[key].value));
            }
        }
        return validators;
    };

}
