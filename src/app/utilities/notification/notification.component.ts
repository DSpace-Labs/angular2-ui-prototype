import { Component } from 'angular2/core';

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
export class NotificationComponent {

    /**
     *
     */
    private notifications: Array<Notification>;

    /**
     *
     */
    constructor(private notificationService: NotificationService) {
        this.notifications = notificationService.notifications;
        notificationService.notificationsObservable.subscribe(notifications => {
            this.notifications = notifications;
        });
    }

    /**
     *
     */
    private dismiss(notification: Notification): void {
        this.notificationService.remove(notification);
    }

}
