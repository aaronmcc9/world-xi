import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertType } from './alert-type.enum';
//style({ opacity: 0 }
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    trigger('fade', [
      state('invisible', style({
        transform: 'translateY(0)'
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

  @Input('alertType') alertType: AlertType = AlertType.None;
  @Input('message') message: string = '';
  alertStyle: string = '';
  state = "invisible";


  constructor() { }

  ngOnInit(): void {
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
  }
}
