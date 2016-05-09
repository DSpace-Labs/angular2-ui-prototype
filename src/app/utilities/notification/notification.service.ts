import { Injectable } from 'angular2/core';
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
    private _notifications: Array<Notification>;

    /**
     *
     */
    private notificationsSubject : Subject<any>;

    /**
     *
     */
    notificationsObservable: Observable<any>;

    /**
     *
     */
    constructor() {
        this.notificationsSubject = new Subject<Array<Notification>>();
        this.notificationsObservable = this.notificationsSubject.asObservable();
    }

    /**
     *
     */
    get notifications(): Array<Notification> {
        return this._notifications;
    }

    /**
     *
     */
    set notifications(notifications: Array<Notification>) {
        this._notifications = notifications;
        this.notificationsSubject.next(this.notifications);
    }

    /**
     *
     */
    add(notification: Notification): void {
        this.notifications.push(notification);
        this.notificationsSubject.next(this._notifications);
    }

    /**
     *
     */
    remove(notification: Notification): void {
        for(let i = this.notifications.length; i >= 0; i--) {
            if(this.notifications[i].id == notification.id) {
                this.notifications.splice(i, 1);
                break;
            }
        }
        this.notificationsSubject.next(this.notifications);
    }

}
