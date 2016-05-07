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
     * 
     */
    private formStore: Map<string, Array<FormInput>>;

    /**
     * @param httpService 
     *      HttpService is a singleton service to provide basic xhr requests.
     */
    constructor(private httpService: HttpService) {
        this.formStore = new Map<string, Array<FormInput>>();
    }

    /**
     * Get the metadata input form json.
     */
    getForm(form: string): Observable<Array<FormInput>> {
        let inputs = this.formStore.get(form);
        if(inputs) {
            console.log('already have form')
            return Observable.create(observer => {
                observer.next(inputs);
                observer.complete();
            });
        }
        else {
            return this.httpService.get({
                url: URLHelper.relativeToAbsoluteUIURL('/static/forms/' + form + '.json')
            }).map(json => {
                inputs = new Array<FormInput>();
                for(let input of json) {
                    inputs.push(new FormInput(input));
                }
                this.formStore.set(form, inputs);
                return inputs;
            });
        }
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
