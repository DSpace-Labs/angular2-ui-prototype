import {Injectable, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {$WebSocket} from 'angular2-websocket/angular2-websocket'

@Injectable()
export class WebSocketService {

    webSocket: WebSocket;

    pending: Array<string>;

    emitter: EventEmitter<string>;

    resolveMap: Map<Object, Object>;

    isReady: boolean;

    constructor() {

        this.webSocket = new WebSocket("ws://localhost:3001");

        this.isReady = false;

        this.pending = new Array<string>();

        this.emitter = new EventEmitter<string>();

        this.resolveMap = new Map<Object, Object>();

        this.webSocket.onerror = ((event) => {
            console.log(event);
        });

        this.webSocket.onmessage = ((event) => {
            this.emitter.next(event);
        });

        this.webSocket.onclose = ((event) => {
            console.log(event);
        });

        this.webSocket.onopen = ((event) => {
            console.log(event);
            this.isReady = true;
            this.pending.forEach(request => {
                this.webSocket.send(request);
            });
        });

        this.emitter.subscribe((event) => {
            let data = JSON.parse(event.data);
            let resolve = this.resolveMap.get(data.file);
            console.log(data.content);
            console.log(resolve);
        });

    }

    ready() {
        let wss = this;
        return new Promise(function (resolve, reject) {
            if (wss.isReady) {
                resolve();
            }
            else {
                reject();
            }
        });
    }

    getJson(file) {
        let wss = this;
        return new Promise(function (resolve, reject) {
            wss.ready().then(function () {
                wss.webSocket.send(file);
            }, function () {
                wss.pending.push(file);
            });
            wss.resolveMap.set(file, resolve);
        });
    }

    getManyJson(files) {
        let observableBatch = [];
        files.forEach(file => {
            observableBatch.push(this.getJson(file));
        });
        return Observable.forkJoin(observableBatch);
    }

}