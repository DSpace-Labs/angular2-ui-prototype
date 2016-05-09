/**
 *
 */
export class Notification {

    /**
     *
     */
    private _id: number; // doubles as timestamp

    /**
     *
     */
    private _type: string;

    /**
     *
     */
    private _message: string;

    /**
     *
     */
    private _duration: number;

    /**
     *
     */
    constructor(type: string, message: string, duration?: number) {
        var date = new Date();
        this.id = date.getTime();
        this.type = type;
        this.message = message;
        this.duration = duration ? duration * 1000 : 15000; // default is 15 seconds
    }

    /**
     *
     */
    get id(): number {
        return this._id;
    }

    /**
     *
     */
    set id(id: number) {
        this._id = id;
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
    get message(): string {
        return this._message;
    }

    /**
     *
     */
    set message(message: string) {
        this._message = message;
    }

    /**
     *
     */
    get duration(): number {
        return this._duration;
    }

    /**
     *
     */
    set duration(duration: number) {
        this._duration = duration;
    }

}
