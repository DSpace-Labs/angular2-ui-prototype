import * as fs from 'fs';
import * as path from 'path';
import {TranslateLoader} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

/**
 * A TranslateLoader for ng2-translate, that loads translations 
 * from the local filesystem instead of from a remote json file
 */
export class FileSystemLoader implements TranslateLoader {
    private prefix: string;
    private suffix: string;

    constructor(prefix?: string, suffix?: string) {
        this.prefix = prefix || 'i18n';
        this.suffix = suffix || '.json';
    }

    getTranslation(lang:string):Observable<any> {
        let dataEventName = 'data';
        let errorEventName = 'error';
        let finishEventName = 'end';
        let stream = fs.createReadStream(path.join(this.prefix, `${lang}${this.suffix}`), { encoding: 'utf8' });

        stream.pause();

        return Observable.create((observer: Observer<string>) => {
            function dataHandler(data: string) {
                observer.next(data);
            }

            function errorHandler(err: any) {
                observer.error(err);
            }

            function endHandler() {
                observer.complete();
            }

            stream.addListener(dataEventName, dataHandler);
            stream.addListener(errorEventName, errorHandler);
            stream.addListener(finishEventName, endHandler);

            stream.resume();

            return function () {
                stream.removeListener(dataEventName, dataHandler);
                stream.removeListener(errorEventName, errorHandler);
                stream.removeListener(finishEventName, endHandler);
            };
        })
            .publish()
            .refCount()
            .map(function (res) {
                return JSON.parse(res);
            });
    }

}