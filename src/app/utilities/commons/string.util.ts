import {ObjectUtil} from "./object.util.ts";

/**
 *
 */
export class StringUtil {

    /**
     Verifies that a value is `null` or an empty string.

     StringUtil.isEmpty(null);            // true
     StringUtil.isEmpty(undefined);       // true
     StringUtil.isEmpty('');              // true
     StringUtil.isEmpty('Adam Hawkins');  // false
     StringUtil.isEmpty('\n\t');          // false
     StringUtil.isEmpty('  ');            // false
     */
    static isEmpty(value: string): boolean {
        return ObjectUtil.isEmpty(value);
    }

    /**
     Verifies that a value is not `null` or an empty string.

     StringUtil.isNotEmpty(null);            // false
     StringUtil.isNotEmpty(undefined);       // false
     StringUtil.isNotEmpty('');              // false
     StringUtil.isNotEmpty('Adam Hawkins');  // true
     StringUtil.isNotEmpty('\n\t');          // true
     StringUtil.isNotEmpty('  ');            // true
     */
    static isNotEmpty(value: string): boolean {
        return ObjectUtil.isNotEmpty(value);
    }

    /**
     A value is blank if it is empty or a whitespace string.

     StringUtil.isBlank(null);            // true
     StringUtil.isBlank(undefined);       // true
     StringUtil.isBlank('');              // true
     StringUtil.isBlank('\n\t');          // true
     StringUtil.isBlank('  ');            // true
     StringUtil.isBlank('\n\t Hello');    // false
     StringUtil.isBlank('Hello world');   // false
     */
    static isBlank(value: string): boolean {
        return StringUtil.isEmpty(value) || value.match(/\S/) === null;
    }

    /**
     Returns true if the value is not blank

     StringUtil.isNotBlank(null);            // false
     StringUtil.isNotBlank(undefined);       // false
     StringUtil.isNotBlank('');              // false
     StringUtil.isNotBlank('\n\t');          // false
     StringUtil.isNotBlank('  ');            // false
     StringUtil.isNotBlank('\n\t Hello');    // true
     StringUtil.isNotBlank('Hello world');   // true
     */
    static isNotBlank(value: string): boolean {
        return !StringUtil.isBlank(value);
    }

}
