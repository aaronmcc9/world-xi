import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationType } from '../api/User/Notification/notification-type.enum';
import { Notification } from '../api/User/Notification/notification.dto';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnChanges {

  @Input() notification: Notification | null = null;
  readonly notificationType = NotificationType;
  notificationHeader = "";

  constructor(private translateService: TranslateService) { }

  ngOnChanges(): void {
    if (!this.notification)
      return;

    switch (this.notification.notificationType) {
      case NotificationType.FriendRequest:
        this.notificationHeader = this.translateService.instant("FRIEND_REQUEST")
        break;
      case NotificationType.System:
        this.notificationHeader = this.translateService.instant("SYSTEM_NOTIFICATION",)
        break;
      case NotificationType.GameRequest:
        this.notificationHeader = this.translateService.instant("FRIEND_REQUEST")
        break;
      case NotificationType.SocialMessage:
        this.notificationHeader = this.translateService.instant("SOCIAL_NOTIFICATION")
        break;
    }
    if (this.notification.message.length < 69) {
      this.notification.message = this.notification.message.substring(0, 68) + "...";
    }
  }
}
