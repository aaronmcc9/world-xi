import { Component, OnInit } from '@angular/core';
import { faGear, faBell } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
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


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.userLoggedIn.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });
  }

  logout() {
    this.authService.logout();
  }
}
