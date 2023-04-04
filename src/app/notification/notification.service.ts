import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Notification } from "../api/User/Notification/notification.dto";

@Injectable({
    providedIn: "root"
})
export class NotificationService {

    notifications = new BehaviorSubject<Notification[]>([]);

    updateNotification(notification: Notification) {

        let updatedNotifications = this.notifications.getValue()
            .map((n: Notification) => {
                if (n.id === notification.id)
                    return notification;

                return n;
            });

        this.notifications.next(updatedNotifications);
    }
}