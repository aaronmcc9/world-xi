import { Component, OnInit } from '@angular/core';
import { faGear, faBell } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/api/User/Notification/notification-type.enum';
import { AuthService } from 'src/app/auth/auth/auth.service';

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
  take = 10;
  notificationType: NotificationType = NotificationType.All;


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.userLoggedIn.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });
  }

  logout() {
    this.authService.logout();
  }

  async fetchUserNotifications(){

  }
}
