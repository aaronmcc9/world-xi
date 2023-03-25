import { Component, Input, OnInit } from '@angular/core';
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

  canMoveRight = false;
  itemsViewingCount = 0;
  skip = 0;
  pageSize = 5;
  page = 1;
  take = this.pageSize;
  notifications: Notification[] = [];
  notificationsTotal = 0;
  sizeMenu = false;

  constructor(private notificationApiService: NotificationApiService,
    private alertService: AlertService) { }

  async ngOnInit(): Promise<void> {
    await this.reset();
  }

  private async reset() {
    this.notifications = await this.fetchNotifications();
  }

  async fetchNotifications(): Promise<Notification[]> {
    try {
      const result = await lastValueFrom(this.notificationApiService.fetchNotifications(this.skip, this.take));

      if (result.success) {
        this.notificationsTotal = result.data.total;
        this.itemsViewingCount = result.data.items.length + this.skip;
        this.canMoveRight = this.take < this.notificationsTotal;
        return result.data.items;
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

  async onPageChanged(page: number) {
    this.page = page;
    this.take = this.pageSize * this.page;
    this.skip = this.take - this.pageSize

    await this.reset();
  }

}
