import { Component, Input, OnInit } from '@angular/core';
import { AlertComponent } from 'ng2-bootstrap/ng2-bootstrap';
import { TranslatePipe } from "ng2-translate/ng2-translate";

import { NotificationService } from './notification.service';

import { Notification } from './notification.model';

/**
 * 
 */
@Component({
    selector: 'notification',
    pipes: [ TranslatePipe ],
    directives: [ AlertComponent ],
    template: `
                <alert *ngFor="let notification of notifications" [type]="notification.type" dismissible="true" dismissOnTimeout="{{notification.duration}}" (close)="dismiss(notification)">
                    {{ notification.message }}
                </alert>
              `
})
export class NotificationComponent implements OnInit {

    @Input("channel") private channel: string;

    /**
     * Notifications for this notification component.
     */
    private notifications: Array<Notification>;

    /**
     *
     * @param notificationService
     *      NotificationService is is singleton service used to manage notifications.
     */
    constructor(private notificationService: NotificationService) {}

    /**
     *
     */
    ngOnInit() {
        this.notifications = new Array<Notification>();
        this.notificationService.registerChannel(this.channel).subscribe(notifications => {
            this.notifications = notifications;
        });
    }

    /**
     * Dismiss notification.
     *
     * @param notification
     *      Notification to dismiss
     */
    private dismiss(notification: Notification): void {
        this.notificationService.remove(this.channel, notification);
    }

}
