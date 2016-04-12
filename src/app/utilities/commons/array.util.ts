import {ObjectUtil} from "./object.util";

export class ArrayUtil {

    /**
     * Verifies that an array is empty
     * 
     * ArrayUtil.isEmpty(null);           // true
     * ArrayUtil.isEmpty(undefined);      // true
     * ArrayUtil.isEmpty([]);             // true
     * ArrayUtil.isEmpty([0,1,2]);        // false
     */
    static isEmpty(array: Array<any>) {
        return ObjectUtil.hasNoValue(array) || array.length === 0;
    }

    /**
     * Verifies that an array isn't empty
     *
     * ArrayUtil.isNotEmpty(null);        // false
     * ArrayUtil.isNotEmpty(undefined);   // false
     * ArrayUtil.isNotEmpty([]);          // false
     * ArrayUtil.isNotEmpty([0,1,2]);     // true
     */
    static isNotEmpty(array: Array<any>) {
        return ObjectUtil.hasValue(array) && array.length > 0;
    }
    
    
}