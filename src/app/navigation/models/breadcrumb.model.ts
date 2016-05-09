/**
 * A model for a breadcrumb.
 */
export class Breadcrumb {

    /**
     * 
     */
    private _type: string;

    /**
     * 
     */
    private _name: string;

    /**
     * 
     */
    private _component: string;

    /**
     * 
     */
    private _root: boolean;

    /**
     * 
     */
    constructor(value: string, root?: boolean) {
        value = value.toLowerCase();
        this.type = value;
        this.name = value.charAt(0).toUpperCase() + value.substring(1, value.length);
        this.component = '/' + this.name;
        this.root = root ? root : false;
    }

    /**
     * 
     */
    get type(): string {
        return this._type;
    }

    /**
     * 
     */
    set type(type: string) {
        this._type = type;
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
    set name(name: string) {
        this._name = name;
    }

    /**
     * 
     */
    get component(): string {
        return this._component;
    }

    /**
     * 
     */
    set component(component: string) {
        this._component = component;
    }

    /**
     * 
     */
    get root(): boolean {
        return this._root;
    }

    /**
     * 
     */
    set root(root: boolean) {
        this._root = root;
    }

}
