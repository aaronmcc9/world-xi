import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faGear, faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificationApiService } from 'api/Dto/User/Notification/notification-api.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { NotificationType } from 'src/app/api/User/Notification/notification-type.enum';
import { Notification } from 'src/app/api/User/Notification/notification.dto';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { DropdownDirective } from 'src/app/common/dropdown.directive';
import { NotificationService } from 'src/app/notification/notification.service';

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
        private alertService: AlertService, private notificationService: NotificationService,
        private router: Router) { }

    async ngOnInit(): Promise<void> {
        this.userSub = this.authService.userLoggedIn.subscribe(async (isLoggedIn) => {

            this.notificationService.notifications.subscribe((notifications: Notification[]) => {
                this.notifications = notifications;
                this.hasUnreadNotifications = this.notifications.some(n => !n.read);
            })

            //dont keep fetching only if value changes
            //if auth is false here, it will be true in a moment if this case is met
            if (!this.isAuthenticated && this.isAuthenticated != isLoggedIn) {
                await this.fetchUserNotifications()
            }
            this.isAuthenticated = isLoggedIn;
        });
    }

    logout() {
        this.authService.logout();
    }

    async fetchUserNotifications(skip?: number, take?: number) {
        try {
            const result = await lastValueFrom(this.notificationApiService.fetchNotifications(skip ?? this.skip, take ?? this.take));

            if (result.success) {
                this.notificationService.notifications.next(result.data.items);
            }
            else {
                this.alertService.toggleAlert("", AlertType.Danger, result.message);
            }
        }
        catch (e) {
            this.alertService.toggleAlert("ALERT_NOTIFICATION_FETCH_FAILURE", AlertType.Danger);
        }
    }

    onNotificationClick(notificationId: number) {
        this.router.navigate(['notifications/' + notificationId])
    }

    async toggleNotificationTray(open: boolean) {
        if (this.element) {
            if (!this.element.isOpen && open)
                await this.fetchUserNotifications();

            this.element.setOpen(open);
        }
    }
}
