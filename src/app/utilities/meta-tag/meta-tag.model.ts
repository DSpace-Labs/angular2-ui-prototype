import * as hash from 'object-hash';

import { Hashable } from "../lang/hashable.interface";
import { Equatable } from "../lang/equatable.interface";
import { ObjectUtil } from "../commons/object.util";

/**
 * A class representing a <meta> tag.
 *
 * MetaTag implements IHashable:
 * two MetaTag objects with the exact same attributes will have
 * identical hashCodes
 *
 * MetaTag implements IEquatable:
 * MetaTag objects have an equals() method that uses their hashCode
 * to determine equality
 */
export class MetaTag implements Hashable, Equatable<MetaTag> {

    /**
     * MetaTags need to be hashable, and the hash for null and undefined differs.
     * So these properties are all set to null to normalize that behavior
     * That's also the reason for the explicit set to null in the setters.
     */
    private _id: string = null;
    private _name: string = null;
    private _content: string = null;
    private _scheme: string = null;
    private _lang: string = null;
    
    /**
     *
     */
    get id(): string {
        return this._id;
    }

    /**
     *
     */
    set id(value: string) {
        this._id = ObjectUtil.hasValue(value) ? value : null;
    }

    /**
     *
     */
    get name(): string {
        return this._name;
    }

    /**
     *
     */
    set name(value: string) {
        this._name = ObjectUtil.hasValue(value) ? value : null;
    }

    /**
     *
     */
    get content(): string {
        return this._content;
    }

    /**
     *
     */
    set content(value: string) {
        this._content = ObjectUtil.hasValue(value) ? value : null;
    }

    /**
     *
     */
    get scheme(): string {
        return this._scheme;
    }

    /**
     *
     */
    set scheme(value: string) {
        this._scheme = ObjectUtil.hasValue(value) ? value : null;
    }

    /**
     *
     */
    get lang(): string {
        return this._lang;
    }

    /**
     *
     */
    set lang(value: string) {
        this._lang = ObjectUtil.hasValue(value) ? value : null;
    }

    /**
     * Returns a SHA1 hash of this object, provided by the object-hash library
     *
     * @returns {string}
     *      a SHA1 hash of this object
     */
    hashCode(): string {
        return hash(this);
    }

    /**
     * Returns true if the given MetaTag has the same hashCode as this one
     *
     * @param other
     *      the MetaTag object to compare to this one.
     * @returns {boolean}
     *      true if other has the same hashCode as this.
     */
    equals(other: MetaTag): boolean {
        return ObjectUtil.hasValue(other) && this.hashCode() === other.hashCode();
    }

    /**
     * Returns a Builder object to ease the construction of MetaTag objects
     *
     * e.g. MetaTag.getBuilder()
     *             .name("foo")
     *             .content("bar")
     *             .build();
     *
     * @returns {Builder}
     *      a Builder object to construct a new MetaTag
     */
    static getBuilder(): Builder {
        return new Builder();
    }

}

/**
 * A Builder class for MetaTag objects
 */
class Builder {
    /**
     * The MetaTag object under construction
     */
    private _build: MetaTag;

    /**
     * Create a new Builder.
     */
    constructor() {
        this._build = new MetaTag();
    }

    /**
     * Set the id for the new MetaTag
     *
     * @param id
     *      the id for the new MetaTag
     * @returns {Builder}
     *      this
     */
    public id(id: string): Builder {
        this._build.id = id;
        return this;
    }

    /**
     * Set the name for the new MetaTag
     *
     * @param name
     *      the name for the new MetaTag
     * @returns {Builder}
     *      this
     */
    public name(name: string): Builder {
        this._build.name = name;
        return this;
    }

    /**
     * Set the content for the new MetaTag
     *
     * @param content
     *      the content for the new MetaTag
     * @returns {Builder}
     *      this
     */
    public content(content: string): Builder {
        this._build.content = content;
        return this;
    }

    /**
     * Set the scheme for the new MetaTag
     *
     * @param scheme
     *      the scheme for the new MetaTag
     * @returns {Builder}
     *      this
     */
    public scheme(scheme: string): Builder {
        this._build.scheme = scheme;
        return this;
    }

    /**
     * Set the language for the new MetaTag
     *
     * @param lang
     *      the language for the new MetaTag
     * @returns {Builder}
     *      this
     */
    public lang(lang: string): Builder {
        this._build.lang = lang;
        return this;
    }

    /**
     * Returns the new MetaTag object
     *
     * @returns {MetaTag}
     *      the constructed MetaTag
     */
    public build(): MetaTag {
        return this._build;
    }

}
