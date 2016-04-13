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

    static filterBy<T>(array: Array<T>, property:string, value:any): Array<T> {
        return array.filter((element:T) => {
            return element[property] === value;
        })
    }
    
    static findBy<T>(array: Array<T>, property:string, value:any): T {
        return array.find((element:T) => {
            return element[property] === value;
        })
    }
    

    static mapBy(array: Array<any>, property:string): Array<any> {
        return array.map((element:any) => {
            return element[property];
        })
    }
    
}