import {IHashable} from "../lang/hashable.interface";
import {IEquatable} from "../lang/equatable.interface.ts";
import * as hash from 'object-hash';
import {ObjectUtil} from "../commons/object.util";

export class MetaTag implements IHashable, IEquatable<MetaTag> {
    private _id:string;
    private _name:string;
    private _content:string;
    private _scheme:string;
    private _lang:string;
    
    get id():string {
        return this._id;
    }

    set id(value:string) {
        this._id = value;
    }

    get name():string {
        return this._name;
    }

    set name(value:string) {
        this._name = value;
    }

    get content():string {
        return this._content;
    }

    set content(value:string) {
        this._content = value;
    }

    get scheme():string {
        return this._scheme;
    }

    set scheme(value:string) {
        this._scheme = value;
    }

    get lang():string {
        return this._lang;
    }

    set lang(value:string) {
        this._lang = value;
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
