export class ObjectUtil {
    /**
     Returns true if the passed value is null or undefined. 

     ObjectUtil.hasNoValue();              // true
     ObjectUtil.hasNoValue(null);          // true
     ObjectUtil.hasNoValue(undefined);     // true
     ObjectUtil.hasNoValue('');            // false
     ObjectUtil.hasNoValue([]);            // false
     ObjectUtil.hasNoValue(function() {}); // false
     */
    static hasNoValue(obj?: any): boolean {
        return obj === null || obj === undefined;
    }

    /**
     Returns true if the passed value is not null or undefined.

     ObjectUtil.hasValue();              // false
     ObjectUtil.hasValue(null);          // false
     ObjectUtil.hasValue(undefined);     // false
     ObjectUtil.hasValue('');            // true
     ObjectUtil.hasValue([]);            // true
     ObjectUtil.hasValue(function() {}); // true
     */
    static hasValue(obj?: any): boolean {
        return !ObjectUtil.hasNoValue(obj);
    }

    /**
     Verifies that a value is `null` or an empty string, empty array,
     or empty function.

     ObjectUtil.isEmpty();                // true
     ObjectUtil.isEmpty(null);            // true
     ObjectUtil.isEmpty(undefined);       // true
     ObjectUtil.isEmpty('');              // true
     ObjectUtil.isEmpty([]);              // true
     ObjectUtil.isEmpty({});              // false
     ObjectUtil.isEmpty('Adam Hawkins');  // false
     ObjectUtil.isEmpty([0,1,2]);         // false
     ObjectUtil.isEmpty('\n\t');          // false
     ObjectUtil.isEmpty('  ');            // false
     */
    static isEmpty(obj?: any): boolean {
        let hasNoValue = ObjectUtil.hasNoValue(obj);
        if (hasNoValue) {
            return hasNoValue;
        }

        if (typeof obj.size === 'number') {
            return !obj.size;
        }

        let objectType = typeof obj;

        if (objectType === 'object') {
            let size = obj['size'];
            if (typeof size === 'number') {
                return !size;
            }
        }

        if (typeof obj.length === 'number' && objectType !== 'function') {
            return !obj.length;
        }

        if (objectType === 'object') {
            let length = obj['length'];
            if (typeof length === 'number') {
                return !length;
            }
        }

        return false;
    }


    /**
     Verifies that a value is not `null`, an empty string, empty array,
     or empty function.

     ObjectUtil.isNotEmpty();                // false
     ObjectUtil.isNotEmpty(null);            // false
     ObjectUtil.isNotEmpty(undefined);       // false
     ObjectUtil.isNotEmpty('');              // false
     ObjectUtil.isNotEmpty([]);              // false
     ObjectUtil.isNotEmpty({});              // true
     ObjectUtil.isNotEmpty('Adam Hawkins');  // true
     ObjectUtil.isNotEmpty([0,1,2]);         // true
     ObjectUtil.isNotEmpty('\n\t');          // true
     ObjectUtil.isNotEmpty('  ');            // true
     */
    static isNotEmpty(obj?: any): boolean {
        return !ObjectUtil.isEmpty(obj);
    }

}
