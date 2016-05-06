import {DOM} from "angular2/src/platform/dom/dom_adapter";
import {Injectable, Inject} from "angular2/core";
import {DOCUMENT} from 'angular2/platform/common_dom';

import {MetaTag} from "./meta-tag.model";
import {ArrayUtil} from "../commons/array.util";
import {ObjectUtil} from "../commons/object.util";
import {StringUtil} from "../commons/string.util";

/**
 * This service can add and remove meta tags to the <head>
 *
 * Because it needs to work both server and client side, a lot of
 * operations that should be handled by the DOMAdapter, are handled
 * in this class. e.g. DOM.query isn't implemented server side, so
 * searching happens by iterating over DOM nodes in this class.
 */
@Injectable()
export class MetaTagService {

    /**
     * An array of the <meta> elements that were in the <head> before
     * this service was initialized for the first time
     */
    private _preExistingTags: Array<MetaTag> = null;

    /**
     * An array of the <meta> elements that were added by this service
     */
    private _addedTags: Array<MetaTag> = null;

    /**
     * The internal reference to the DOM document.
     */
    private _document = null;

    /**
     * Construct the MetaTagService.
     *
     * @param document
     *      the DOM document
     */
    constructor(@Inject(DOCUMENT) document) {
        this._document = document;
        this.initTags();
    }

    /**
     * Initialize the internal tag arrays.
     *
     * _preExistingTags gets populated by going over the current <meta>
     * elements in the DOM.
     *
     * _addedTags is set to an empty array.
     */
    private initTags(): void {
        if (ObjectUtil.hasNoValue(this._preExistingTags)) {
            this._preExistingTags = this.getMetaNodesInDOM()
                .map((meta: Node) => {
                    return this.nodeToMetaTag(meta);
                });
        }
        this._addedTags = new Array<MetaTag>();
    }

    /**
     * Turn a meta Node into a MetaTag object.
     *
     * @param meta
     *      a DOM Node representing a <meta> element
     * @returns {MetaTag}
     *      a MetaTag representing that <meta> element
     */
    private nodeToMetaTag(meta:Node): MetaTag {
        return MetaTag.getBuilder()
            .id(this.getMetaAttributeValue(meta, 'id'))
            .name(this.getMetaAttributeValue(meta, 'name'))
            .content(this.getMetaAttributeValue(meta, 'content'))
            .scheme(this.getMetaAttributeValue(meta, 'scheme'))
            .lang(this.getMetaAttributeValue(meta, 'xml:lang'))
            .build();
    }

    /**
     * Turn a MetaTag object into a Node object
     *
     * @param newTag
     *      a MetaTag representing a <meta> element
     * @returns {Node}
     *      a Node representing that <meta> element
     */
    private metaTagToNode(newTag: MetaTag): Node {
        let meta = DOM.createElement('meta');
        if (ObjectUtil.isNotEmpty(newTag.id)) {
            DOM.setAttribute(meta, 'id', newTag.id);
        }
        if (ObjectUtil.isNotEmpty(newTag.name)) {
            DOM.setAttribute(meta, 'name', newTag.name);
        }
        if (ObjectUtil.isNotEmpty(newTag.content)) {
            DOM.setAttribute(meta, 'content', newTag.content);
        }
        if (ObjectUtil.isNotEmpty(newTag.scheme)) {
            DOM.setAttribute(meta, 'scheme', newTag.scheme);
        }
        if (ObjectUtil.isNotEmpty(newTag.lang)) {
            DOM.setAttribute(meta, 'xml:lang', newTag.lang);
        }
        return meta;
    }

    /**
     * Get a list of the <meta> elements in the DOM
     *
     * @returns {Node[]}
     *      A array containing Node objects for each <meta> element
     *      in the DOM in the order they appear.
     */
    private getMetaNodesInDOM(): Array<Node> {
        let children = this.htmlCollectionToNodeArray(this._document.head.children);
        if (ArrayUtil.isNotEmpty(children)) {
            return children
                .filter((child:Node) => {
                    return child.localName === 'meta';
                });
        }
        else {
            return new Array<Node>();
        }
    }

    /**
     * Get the value of an attribute of a <meta> element.
     *
     * This should be done by using HTMLMetaElement objects instead
     * of Node objects, but because namespace support isn't implemented server
     * side as of yet, it would be impossible to retrieve e.g. the xml:lang
     * attribute that way.
     *
     * @param meta
     *      a Node representing a <meta> element
     * @param attributeName
     *      the name, including the namespace, of an attribute on a <meta> element
     *      e.g. scheme, content, xml:lang
     * @returns {string}
     *      the value for the requested attribute.
     *      undefined if the attribute doesn't exist
     */
    private getMetaAttributeValue(meta: Node, attributeName: string): string {
        if (ObjectUtil.isNotEmpty(meta)
            && ObjectUtil.isNotEmpty(meta.attributes)
            && ObjectUtil.isNotEmpty(meta.attributes[attributeName])
            && StringUtil.isNotBlank(meta.attributes[attributeName].value)) {
            return meta.attributes[attributeName].value;
        }
        else {
            return undefined;
        }
    }

    /**
     * Turn a HTMLCollection object into an array of Node objects.
     *
     * @param collection
     *      a HTMLCollection object
     * @returns {Node[]}
     *      that collection as a Node array
     */
    private htmlCollectionToNodeArray(collection: HTMLCollection): Array<Node> {
        return new Array<Node>().slice.call(collection);
    }

    /**
     * Return true if the given tag is part of the given array.
     *
     * @param tagToFind
     *      the MetaTag object to search for
     * @param tagArray
     *      the array of MetaTag objects to search in.
     * @returns {boolean}
     *      true if tagToFind is part of tagArray, false otherwise
     */
    private tagIsPartOfArray(tagToFind: MetaTag, tagArray: Array<MetaTag>): boolean {
        let existingTag = tagArray.find((tag) => {
            return tag.equals(tagToFind);
        });
        return ObjectUtil.hasValue(existingTag);
    }

    /**
     * Returns true if the given tag is not already present in this.tags
     *
     * @param tagToFind
     *      the MetaTag object to search for
     * @returns {boolean}
     *      true if tagToFind is part of this.tags
     */
    private tagDoesntAlreadyExist(tagToFind: MetaTag): boolean {
        return !this.tagIsPartOfArray(tagToFind, this.tags);
    }

    /**
     * Get the last <meta> element in the DOM.
     *
     * @returns {Node}
     *      a Node object representing the last <meta> element in the DOM.
     */
    private getLastMetaNode(): Node {
        let lastMetaNode:Node = null;
        let currentNode = this._document.head.lastChild;
        do {
            //localName: for browsers, name: server-side
            if (currentNode.localName === 'meta' || currentNode.name === 'meta') {
                lastMetaNode = currentNode;
            }
            currentNode = currentNode.previousSibling;
        } while (ObjectUtil.hasNoValue(lastMetaNode) && ObjectUtil.hasValue(currentNode));

        return lastMetaNode;
    }

    /**
     * Insert the given meta Node in the DOM, either beneath the last <meta> element
     * already in the DOM, or if there aren't any, as the first element of the <head>.
     *
     * This is because preboot can add elements to the <head> that shouldn't be there
     * according to the HTML spec (e.g. <div>), and if you add <meta> elements below
     * those, some browsers don't recognize them.
     *
     * @param meta
     *      the meta Node object to be inserted in the DOM.
     */
    private insertMetaNodeIntoDOM(meta: Node): void {
        let lastMetaNode = this.getLastMetaNode();
        if (ObjectUtil.hasValue(lastMetaNode)) {
            DOM.insertAfter(lastMetaNode, meta);
        }
        else {
            DOM.insertBefore(this._document.head.firstChild, meta);
        }
    }

    /**
     * Return the given tagArray, without the given tag.
     *
     * @param tagToExclude
     *      the MetaTag to exclude from tagArray
     * @param tagArray
     *      the Array<MetaTag> to exclude tagToExclude from
     * @returns {Array<MetaTag>}
     *      tagArray without the element tagToExlude
     */
    private excludeTagFromArray(tagToExclude: MetaTag, tagArray: Array<MetaTag>): Array<MetaTag> {
        return tagArray.filter((tag:MetaTag) => {
            return !tag.equals(tagToExclude);
        });
    }

    /**
     * Return an array of MetaTag objects that represent all <meta> elements
     * currently in the DOM, regardless of whether they were added by this
     * service
     *
     * @returns {Array<MetaTag>}
     *      an array of MetaTag objects that represent all <meta> elements
     *      currently in the DOM
     */
    get tags(): Array<MetaTag> {
        let allTags: Array<MetaTag> = new Array<MetaTag>();
        if (ArrayUtil.isNotEmpty(this._preExistingTags)) {
            allTags = allTags.concat(this._preExistingTags);
        }
        if (ArrayUtil.isNotEmpty(this._addedTags)) {
            allTags = allTags.concat(this._addedTags);
        }
        return allTags;
    }

    /**
     * Add the given MetaTag object as a <meta> element to the DOM.
     *
     * @param newTag
     *      the MetaTag to be added
     */
    public addTag(newTag: MetaTag): void {
        if (this.tagDoesntAlreadyExist(newTag)) {
            this._addedTags.push(newTag);
            let meta = this.metaTagToNode(newTag);
            this.insertMetaNodeIntoDOM(meta);

        }
    }

    /**
     * Remove the <meta> elements corresponding to the objects in given Array<MetaTag>
     * from the DOM and the internal MetaTag arrays.
     *
     * @param tagsToRemove
     *      the list of MetaTag objects to remove.      
     */
    public removeTags(tagsToRemove: Array<MetaTag>): void {
        if (ArrayUtil.isNotEmpty(tagsToRemove)) {
            this.getMetaNodesInDOM().filter((node:Node) => {
                return this.tagIsPartOfArray(this.nodeToMetaTag(node), tagsToRemove);
            }).forEach((matchingNode: Node) => {
                this._document.head.removeChild(matchingNode);
                let matchingTag = this.nodeToMetaTag(matchingNode);
                this._addedTags = this.excludeTagFromArray(matchingTag, this._addedTags);
                this._preExistingTags = this.excludeTagFromArray(matchingTag, this._preExistingTags);
            });
        }
    }

}
