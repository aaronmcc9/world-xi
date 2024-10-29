import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertType } from './alert-type.enum';
import { Alert } from './alert.model';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    trigger('fade', [
      state('invisible', style({
        transform: 'translateY(-20px)'
      })),
      state('visible', style({
        transform: 'translateY(70px)'
      })),
      transition('invisible => visible', [
        animate(300)
      ]),
      transition('visible => invisible', [
        animate(300)
      ])
    ])
  ]
})
export class AlertComponent implements OnInit, OnDestroy {

  alertType: AlertType = AlertType.None;
  message: string = '';
  alertStyle: string = '';
  state = "invisible";
  alertSubscription = new Subscription()

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {

    this.alertSubscription = this.alertService.alertSubscription.subscribe((alert: Alert) => {
      this.message = alert.message;
      this.alertType = alert.alertType;
      this.setAlert();
    });
  }

  private setAlert() {
    switch (this.alertType) {
      case AlertType.None:
        this.alertStyle = '';
        break;
      case AlertType.Success:
        this.alertStyle = 'alert alert-success';
        break;
      case AlertType.Danger:
        this.alertStyle = 'alert alert-danger';
        break;
      case AlertType.Info:
        this.alertStyle = 'alert alert-info';
        break;

      case AlertType.Warning:
        this.alertStyle = 'alert alert-warning';
        break;
    }

    if (this.alertType != AlertType.None) {
      setTimeout(() => {
        this.state = "visible";
      }, 200);

      setTimeout(() => {
        this.state = "invisible";
      }, 6000);
    }
  }

  ngOnDestroy(): void {
    this.message = '';
    this.alertStyle = '';
    this.alertType = AlertType.None;
    this.alertSubscription.unsubscribe();
  }
}
