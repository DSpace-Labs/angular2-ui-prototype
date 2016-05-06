import {GlobalConfig} from "../../../config";
import {ArrayUtil} from "./commons/array.util";

/**
 *
 */
export class URLHelper {

    /**
     * Returns a normalized version of the given url.
     *
     * @param url
     *      the URL to be normalized
     * @returns {string}
     *      a version of url that has the protocol followed by two slashes,
     *      a single slash between each part, no trailing slash before the params,
     *      and only one question mark
     */
    public static normalizeURL(url: string): string {
        // make sure protocol is followed by two slashes
        url = url.replace(/:\//g, '://');

        // remove consecutive slashes
        url = url.replace(/([^:\s])\/+/g, '$1/');

        // remove trailing slash before parameters or hash
        url = url.replace(/\/(\?|&|#[^!])/g, '$1');

        // replace ? in parameters with &
        url = url.replace(/(\?.+)\?/g, '$1&');

        return url;
    }

    /**
     * Combines the given URL parts to a normalized URL
     *
     * e.g.  URLHelper.combineURLParts('http:/foo.com/', '/bar', 'id', '5')
     * returns: http://foo.com/bar/id/5
     *
     * @param parts
     *      a variable number of strings representing the parts of the URL
     *
     * @returns {string}
     *      The combined URL
     */
    public static combineURLParts(...parts:Array<string>): string {
        if (ArrayUtil.isEmpty(parts)) {
            return '';
        }
        else {
            return URLHelper.normalizeURL(parts.join('/'));
        }
    }

    /**
     * Combines the given parts of a relative URL to a normalized
     * absolute URL to the REST API
     *
     * e.g. URLHelper.relativeToAbsoluteRESTURL('/collections/', '/5', '?expand=all')
     * returns: 'http://dspace.rest.api/rest-namespace/collections/5?expand=all'
     *
     * @param parts
     *      a variable number of strings representing the relative parts of the URL
     * @returns {string}
     *      an absolute URL to the REST API
     */
    public static relativeToAbsoluteRESTURL(...parts:Array<string>): string {
        return URLHelper.combineURLParts(GlobalConfig.rest.baseURL, GlobalConfig.rest.nameSpace, ...parts);
    }

    /**
     * Combines the given parts of a relative URL to a normalized
     * absolute URL to the UI server
     *
     * e.g. URLHelper.relativeToAbsoluteUIURL('/items/', '/27', 'full')
     * returns: 'http://dspace.ui/ui-namespace/items/27/full'
     *
     * @param parts
     *      a variable number of strings representing the relative parts of the URL
     * @returns {string}
     *      an absolute URL to the UI server
     */
    public static relativeToAbsoluteUIURL(...parts:Array<string>): string {
        return URLHelper.combineURLParts(GlobalConfig.ui.baseURL, GlobalConfig.ui.nameSpace, ...parts);
    }

}
