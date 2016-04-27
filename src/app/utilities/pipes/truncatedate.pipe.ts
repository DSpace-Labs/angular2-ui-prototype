import {Pipe} from 'angular2/core'

/**
 * Pipe to truncate a value in Angular2. (Take a substring, starting at 0)
 * Default value: 10
 *
 */

@Pipe({
    name: 'truncatedate'
})
export class TruncateDatePipe {
    transform(value: string, args: string[]) : string {
        let limit = args.length > 0 ? parseInt(args[0], 10) : 10; // 10 as default truncate value
        return value.length > limit ? value.substring(0, limit) : value;
    }
}