import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faGear, faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificationApiService } from 'api/Dto/User/Notification/notification-api.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { NotificationType } from 'src/app/api/User/Notification/notification-type.enum';
import { Notification } from 'src/app/api/User/Notification/notification.dto';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { DropdownDirective } from 'src/app/common/dropdown.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  isAuthenticated = false;
  userSub = new Subscription;

  //icon
  settingsIcon = faGear;
  notificationIcon = faBell;

  notifications: Notification[] = [];
  skip = 0;
  take = 3;
  notificationType: NotificationType = NotificationType.All;
  hasUnreadNotifications = false;

  @ViewChild('dd') element: DropdownDirective | null = null;


  constructor(private authService: AuthService, private notificationApiService: NotificationApiService,
    private alertService: AlertService) { }

  async ngOnInit(): Promise<void> {
    this.userSub = this.authService.userLoggedIn.subscribe(async (isLoggedIn) => {
      //dont keep fetching only if value chnages
      //if auth is false here, it will be true in a moment if this case is met
      if (!this.isAuthenticated && this.isAuthenticated != isLoggedIn) {
        await this.fetchUserNotifications()
        console.log("hi")
      }
      this.isAuthenticated = isLoggedIn;
    });
  }

  logout() {
    this.authService.logout();
  }

  async fetchUserNotifications(skip?: number, take?: number) {
    //open event happens after, so while opening, the element isOpen will appear as false
    if (this.element?.isOpen)
      return;

    try {
      const result = await lastValueFrom(this.notificationApiService.fetchNotifications(skip, take));

      if (result.success) {
        this.notifications = result.data;
        this.hasUnreadNotifications = this.notifications.some(n => !n.isRead);
      }
      else {
        this.alertService.toggleAlert(result.message, AlertType.Danger);
      }
    }
    catch (e) {
      this.alertService.toggleAlert("ALERT_NOTIFICATION_FETCH_FAILURE", AlertType.Danger);
    }
  }
}
