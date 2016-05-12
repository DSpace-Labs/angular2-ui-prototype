/**
 *
 */
export class Notification {

    /**
     *
     */
    private _timestamp: number;

    /**
     *
     */
    private _id: number;

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
        this.timestamp = date.getTime();
        this.id = this.timestamp + Math.floor(Math.random() * 10000);
        this.type = type;
        this.message = message;
        this.duration = duration ? duration * 1000 : undefined; // undefined never expires
    }

    /**
     *
     */
    get timestamp(): number {
        return this._timestamp;
    }

    /**
     *
     */
    set timestamp(timestamp: number) {
        this._timestamp = timestamp;
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
        this._type = type.toLowerCase();
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
