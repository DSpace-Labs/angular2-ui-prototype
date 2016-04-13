import {DOM} from "angular2/src/platform/dom/dom_adapter";
import {MetaTag} from "./meta-tag.model";
import {ArrayUtil} from "../commons/array.util";
import {Injectable, Inject} from "angular2/core";
import {DOCUMENT} from 'angular2/platform/common_dom';
import {ObjectUtil} from "../commons/object.util";
import {StringUtil} from "../commons/string.util";

/**
 * This service can add and remove meta tags to the <head>
 * Because it needs to work both server and client side, a lot of
 */
@Injectable()
export class MetaTagService {
    private _hardcodedTags: MetaTag[];
    private _dynamicTags: MetaTag[];
    private _document;

    private initTags(): void {
        if (ArrayUtil.isEmpty(this._hardcodedTags)) {
            this._hardcodedTags = this.getMetaNodesInDOM()
                .map((meta:Node) => {
                    return this.nodeToMetaTag(meta);
                });
        }
        this._dynamicTags = [];
    }

    private nodeToMetaTag(meta:Node): MetaTag {
        return MetaTag.getBuilder()
            .id(this.getMetaAttributeValue(meta, 'id'))
            .name(this.getMetaAttributeValue(meta, 'name'))
            .content(this.getMetaAttributeValue(meta, 'content'))
            .scheme(this.getMetaAttributeValue(meta, 'scheme'))
            .lang(this.getMetaAttributeValue(meta, 'xml:lang'))
            .build();
    }

    get tags(): MetaTag[]{
        let allTags:MetaTag[] = [];
        if (ArrayUtil.isNotEmpty(this._hardcodedTags)) {
            allTags = allTags.concat(this._hardcodedTags);
        }
        if (ArrayUtil.isNotEmpty(this._dynamicTags)) {
            allTags = allTags.concat(this._dynamicTags);
        }
        return allTags;
    }


    private getMetaNodesInDOM(): Node[] {
        let children = this.htmlCollectionToNodeArray(this._document.head.children);
        if (ArrayUtil.isNotEmpty(children)) {
            return children
                .filter((child:Node) => {
                    return child.localName === 'meta';
                });
        }
        else {
            return [];
        }
    }

    private getMetaAttributeValue(meta:Node, attributeName:string):string {
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

    private htmlCollectionToNodeArray(collection:HTMLCollection):Array<Node> {
        return [].slice.call(collection);
    }

    private tagIsPartOfArray(tagToFind: MetaTag, tagArray: MetaTag[]):boolean {
        let existingTag = tagArray.find((tag) => {
            return tag.equals(tagToFind);
        });
        return ObjectUtil.hasValue(existingTag);
    }
    
    private tagDoesntAlreadyExist(newTag: MetaTag): boolean {
        return !this.tagIsPartOfArray(newTag, this.tags);
    }

    constructor(@Inject(DOCUMENT) document) {
        this._document = document;
        this.initTags();
    }

    public addTag(newTag: MetaTag): void {
        if (this.tagDoesntAlreadyExist(newTag)) {
            this._dynamicTags.push(newTag);
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
            DOM.appendChild(this._document.head, meta);
        }
    }

    public removeTags(tags: MetaTag[]): void {
        console.log('removeTags');
        if (ArrayUtil.isNotEmpty(tags)) {
            this.getMetaNodesInDOM().filter((node:Node) => {
                return this.tagIsPartOfArray(this.nodeToMetaTag(node), tags);
            }).forEach((matchingNode: Node) => {
                let matchingTag = this.nodeToMetaTag(matchingNode);
                this._document.head.removeChild(matchingNode);
                this._dynamicTags = this._dynamicTags.filter((tag:MetaTag) => {
                    return !tag.equals(matchingTag);
                })
            });
        }
    }

}