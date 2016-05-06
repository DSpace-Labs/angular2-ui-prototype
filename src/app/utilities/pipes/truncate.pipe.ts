import {Pipe, PipeTransform} from 'angular2/core'
import {ObjectUtil} from "../commons/object.util";

/**
 * Pipe to truncate a value in Angular2. (Take a substring, starting at 0)
 * Default value: 10
 */
@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

    /**
     *
     */
    transform(value: string, args: Array<string>) : string {
        console.log("in pipe");
        console.log(args[0]);
        if (ObjectUtil.hasValue(value)) {
            let limit = (args && args.length > 0) ? parseInt(args[0], 10) : 10; // 10 as default truncate value
            return value.length > limit ? value.substring(0, limit) + "..." : value;
        }
        else {
            return value;
        }
    }

}
