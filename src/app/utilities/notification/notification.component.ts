import { Component, Input, OnInit } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { NotificationService } from './notification.service';

import { Notification } from './notification.model';

/**
 * 
 */
@Component({
    selector: 'notification',
    pipes: [ TranslatePipe ],
    template: `
                <div class="alert fade in" *ngFor="let notification of notifications"
                     [class.alert-success]="notification.success()"
                     [class.alert-warning]="notification.warning()"
                     [class.alert-danger]="notification.danger()"
                     [class.alert-info]="notification.info()">
                     <button type="button" class="close" aria-label="Close" (click)="dismiss(notification)"><span aria-hidden="true">&times;</span></button>
                    {{ notification.message }}
                </div>
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
