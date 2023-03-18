import { Component, OnInit } from '@angular/core';
import { NotificationApiService } from 'api/Dto/User/Notification/notification-api.service';
import { Notification } from '../api/User/Notification/notification.dto';
import { lastValueFrom } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { AlertType } from '../alert/alert-type.enum';


@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent implements OnInit {

  skip = 0;
  pageSize = 10;
  take = this.pageSize;
  notifications: Notification[] = [];
  notificationsTotal = 0;

  constructor(private notificationApiService: NotificationApiService,
    private alertService: AlertService) { }

  async ngOnInit(): Promise<void> {
    this.notifications = await this.fetchNotifications();
  }

  async fetchNotifications(): Promise<Notification[]> {
    try {
      const result = await lastValueFrom(this.notificationApiService.fetchNotifications(this.skip, this.take));

      if (result.success) {
        // this.notificationsTotal = result.data.items;
        return result.data;
      }
      else {
        this.alertService.toggleAlert("", AlertType.Danger, result.message);
      }
    }
    catch (e) {
      this.alertService.toggleAlert("ALERT_NOTIFICATION_FETCH_FAILURE", AlertType.Danger);
    }

    return [];
  }
}
