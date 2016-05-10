import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Notification } from './notification.model';

/**
 * 
 */
@Injectable()
export class NotificationService {

    /**
     *
     */
    private notificationsMap: Map<string, Array<Notification>>;

    /**
     *
     */
    private notificationsSubjects : Map<string, Subject<Array<Notification>>>;

    /**
     *
     */
    notificationsObservables: Map<string, Observable<Array<Notification>>>;

    /**
     *
     */
    constructor() {
        this.notificationsMap = new Map<string, Array<Notification>>();
        this.notificationsSubjects = new Map<string, Subject<Array<Notification>>>();
        this.notificationsObservables = new Map<string, Observable<Array<Notification>>>();
    }

    registerChannel(channel: string): Observable<Array<Notification>> {
        this.notificationsMap.set(channel, new Array<Notification>());

        let notificationsSubject = new Subject<Array<Notification>>();
        this.notificationsSubjects.set(channel, notificationsSubject);

        let notificationsObservable = notificationsSubject.asObservable();
        this.notificationsObservables.set(channel, notificationsObservable);

        return notificationsObservable;
    }

    /**
     *
     */
    notify(channel: string, type: string, message: string, duration?: number): void {
        let notification = duration ? new Notification(type, message, duration) : new Notification(type, message);
        this.add(channel, notification);
    }

    /**
     *
     */
    add(channel: string, notification: Notification): void {
        let notifications = this.notificationsMap.get(channel);
        notifications.push(notification);

        let notificationsSubject = this.notificationsSubjects.get(channel);
        notificationsSubject.next(notifications);

        if(notification.duration) {
            setTimeout(() => {
                this.remove(channel, notification);
            }, notification.duration);
        }
    }

    /**
     *
     */
    remove(channel: string, notification: Notification): void {
        let notifications = this.notificationsMap.get(channel);

        for(let i = notifications.length - 1; i >= 0; i--) {
            if(notifications[i].id == notification.id) {
                notifications.splice(i, 1);
                break;
            }
        }

        let notificationsSubject = this.notificationsSubjects.get(channel);
        notificationsSubject.next(notifications);
    }

}
