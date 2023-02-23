import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationApiService } from 'api/Dto/User/Notification/notification-api.service';
import { lastValueFrom } from 'rxjs';
import { AlertType } from '../alert/alert-type.enum';
import { AlertService } from '../alert/alert.service';
import { FriendRequestApiService } from '../api/User/Friend/friend request/friend-request-api.service';
import { FriendRequestStatus } from '../api/User/Friend/friend request/friend-request-status.enum';
import { UpdateFriendRequest } from '../api/User/Friend/friend request/update-friend-request.dto';
import { NotificationType } from '../api/User/Notification/notification-type.enum';
import { Notification } from '../api/User/Notification/notification.dto';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnChanges {

  @Input() notification!: Notification;
  readonly notificationType = NotificationType;
  notificationHeader = "";

  constructor(private translateService: TranslateService, private friendRequestApiService: FriendRequestApiService,
    private alertService: AlertService, private notificationApiService: NotificationApiService,
    private notificationService: NotificationService) { }

  ngOnChanges(): void {
    if (!this.notification)
      return;

    console.log(this.notification);

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

    //replace date string with local time
    let dateStr = new Date(this.notification.sent).toString()
    this.notification.sent = new Date(dateStr + 'UTC')

    if (this.notification.message.length > 69) {
      this.notification.message = this.notification.message.substring(0, 68) + "...";
    }
  }

  async action(accepted: boolean) {
    if (this.notification.notificationType == NotificationType.FriendRequest) {

      let friendRequest: UpdateFriendRequest = {
        userReceivedId: this.notification.recipientId,
        userSentId: this.notification.senderId!,
        status: accepted ? FriendRequestStatus.Accepted : FriendRequestStatus.Rejected
      };

      this.updateFriendRequest(friendRequest);
    }

    if (this.notification.notificationType == NotificationType.GameRequest) {
      this.updateGameRequest();
    }
  }

  async updateFriendRequest(friendRequest: UpdateFriendRequest) {
    try {
      const result = await lastValueFrom(this.friendRequestApiService.updateFriendRequest(friendRequest, this.notification.id));

      if (result.success) {
        this.notification = result.data;
        this.notification.message = result.message;
        this.alertService.toggleAlert(result.message, AlertType.Info);
      }
      else {
        this.alertService.toggleAlert(result.message, AlertType.Danger);
      }
    }
    catch (e) {
      this.alertService.toggleAlert('ALERT_FRIEND_REQUEST_UPDATE_FAILURE', AlertType.Danger);
    }
  }

  async markAsRead() {
    if(!this.notification){
      this.alertService.toggleAlert("ALERT_NOTIFICATION_NOT_FOUND", AlertType.Danger)
    }
    try{
      const result = await lastValueFrom(this.notificationApiService.updateNotification(this.notification.id, undefined, true, undefined));

      if(result.data){
        this.notification = result.data;
        this.notificationService.updateNotification(this.notification);
      }
      else{
        this.alertService.toggleAlert(result.message, AlertType.Danger)
      }
    }
    catch(e){
      console.log(e)
      this.alertService.toggleAlert("ALERT_NOTIFICATION_UPDATE_FAILURE", AlertType.Danger)
    }
  }

  updateGameRequest() {

  }

}
