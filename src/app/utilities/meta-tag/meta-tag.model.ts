import {IHashable} from "../lang/hashable.interface";
import {IEquatable} from "../lang/equatable.interface.ts";
import * as hash from 'object-hash';
import {ObjectUtil} from "../commons/object.util";

export class MetaTag implements IHashable, IEquatable<MetaTag> {
    /**
     * MetaTags need to be hashable, and the hash for null and undefined differs.
     * So these properties are all set to null to normalize that behavior
     * That's also the reason for the explicit set to null in the setters.
     */
    private _id:string = null;
    private _name:string = null;
    private _content:string = null;
    private _scheme:string = null;
    private _lang:string = null;
    
    get id():string {
        return this._id;
    }

    set id(value:string) {
        this._id = ObjectUtil.hasValue(value) ? value : null;
    }

    get name():string {
        return this._name;
    }

    set name(value:string) {
        this._name = ObjectUtil.hasValue(value) ? value : null;
    }

    get content():string {
        return this._content;
    }

    set content(value:string) {
        this._content = ObjectUtil.hasValue(value) ? value : null;
    }

    get scheme():string {
        return this._scheme;
    }

    set scheme(value:string) {
        this._scheme = ObjectUtil.hasValue(value) ? value : null;
    }

    get lang():string {
        return this._lang;
    }

    set lang(value:string) {
        this._lang = ObjectUtil.hasValue(value) ? value : null;
    }

    hashCode():string {
        return hash(this);
    }

    equals(other:MetaTag):boolean {
        return ObjectUtil.hasValue(other) && this.hashCode() === other.hashCode();
    }

    static getBuilder():Builder {
        return new Builder();
    }

}

class Builder {
    private _build:MetaTag;

    constructor() {
        this._build = new MetaTag();
    }

    public id(id:string):Builder {
        this._build.id = id;
        return this;
    }

    public name(name:string):Builder {
        this._build.name = name;
        return this;
    }

    public content(content:string):Builder {
        this._build.content = content;
        return this;
    }

    public scheme(scheme:string):Builder {
        this._build.scheme = scheme;
        return this;
    }

    public lang(lang:string):Builder {
        this._build.lang = lang;
        return this;
    }

    public build():MetaTag {
        return this._build;
    }
}
