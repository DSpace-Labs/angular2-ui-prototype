import {DSpaceObject} from "./dspaceobject.model";
import {ObjectUtil} from "../../utilities/commons/object.util";
import {StringUtil} from "../../utilities/commons/string.util";
import {URLHelper} from "../../utilities/url.helper";

/**
 * A model class for a Bitstream. Bitstreams represent files in DSpace.
 */
export class Bitstream extends DSpaceObject {

    /**
     * A link that can be used to download the file this Bitstream represents.
     */
    private _retrieveLink: string;
    private _id;
    private _format : string;
    private _size: number;
    private _name: string;
    /**
     * Create a new bitstream
     *
     * @param json
     *      A plain old javascript object representing a bitstream as would be returned 
     *      from the rest api. Currently only json.retrieveLink is used, apart from
     *      the standard DSpaceObject properties
     */
    constructor(json?:any)  {

        if(json!=null)
        {
            super(json); // a DSpaceObject does not contain 'retrieveLink', format, size
            if (ObjectUtil.isNotEmpty(json) && StringUtil.isNotBlank(json.retrieveLink)) {
                this.retrieveLink = URLHelper.relativeToAbsoluteRESTURL(json.retrieveLink);
                this.format = json.mimeType;
                this.size = json.sizeBytes;
            }
        }
    }


    public get retrieveLink():string {
        return this._retrieveLink;
    }

    public set retrieveLink(value:string) {
        this._retrieveLink = value;
    }

    public get id() {
        return this._id;
    }

    public set id(value) {
        this._id = value;
    }

    public get format():string {
        return this._format;
    }

    public set format(value:string) {
        this._format = value;
    }

    public get size():number {
        return this._size;
    }

    public set size(value:number) {
        this._size = value;
    }

    public get name():string {
        return this._name;
    }

    public set name(value:string) {
        this._name = value;
    }
}