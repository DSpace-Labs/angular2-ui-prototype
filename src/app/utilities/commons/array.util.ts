import {ObjectUtil} from "./object.util";

/**
 *
 */
export class ArrayUtil {

    /**
     * Verifies that an array is empty
     * 
     * ArrayUtil.isEmpty(null);           // true
     * ArrayUtil.isEmpty(undefined);      // true
     * ArrayUtil.isEmpty([]);             // true
     * ArrayUtil.isEmpty([0,1,2]);        // false
     */
    static isEmpty(array: Array<any>): boolean {
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
    static isNotEmpty(array: Array<any>): boolean {
        return ObjectUtil.hasValue(array) && array.length > 0;
    }

    /**
     * Returns an array with just the items for which the
     * given property matches the given value
     *
     * e.g. ArrayUtil.filterBy([
     *           {resourcetype: 0},
     *           {resourcetype: 2},
     *           {resourcetype: 0}
     *      ], 'resourcetype', 0)
     * will return a new array containing only the first and third
     * elements of the original array.
     *
     * @param array
     *      the array to filter
     * @param property
     *      the property to filter by
     * @param value
     *      the value that property must have in order for an
     *      element to be included in the result
     * @returns {T[]}
     *      a new array containing only the elements that have property matching value
     */
    static filterBy<T>(array: Array<T>, property: string, value: any): Array<T> {
        return array.filter((element: T) => {
            return element[property] === value;
        })
    }

    /**
     * Returns the first items in the given array for which the
     * given property matches the given value
     *
     * e.g. ArrayUtil.findBy([
     *           {resourcetype: 0},
     *           {resourcetype: 2},
     *           {resourcetype: 0}
     *      ], 'resourcetype', 0)
     * will return the first element of the original array.
     *
     * @param array
     *      the array to search through
     * @param property
     *      the property to check
     * @param value
     *      the value that property must have in order for an
     *      element to match
     * @returns {T}
     *      the first element in the array that has property matching value
     */
    static findBy<T>(array: Array<T>, property: string, value: any): T {
        return array.find((element: T) => {
            return element[property] === value;
        })
    }


    /**
     * Returns a new array containing the value of the given property
     * for all elements of the given array.
     *
     * @param array
     *      the array to map
     * @param property
     *      the property to map by
     * @returns {[]}
     *      a new array containing the values the elements in the original
     *      array had for the given property.
     */
    static mapBy(array: Array<any>, property: string): Array<any> {
        return array.map((element: any) => {
            return element[property];
        })
    }
    
}
