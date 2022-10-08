import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertType } from './alert-type.enum';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        animate(1000, style({opacity: 1}))
      ]),
      transition(':leave', [
        animate(1000, style({opacity: 0}))
      ])
    ])
  ]
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input('alertType') alertType: AlertType = AlertType.None;
  @Input('message') message: string = '';
  alertStyle: string = '';


  constructor() { }

  ngOnInit(): void {
    console.log(this.alertType)
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

    console.log("this.alertStyle", this.alertStyle)
  }

  ngOnDestroy(): void {
    this.message = '';
    this.alertStyle = '';
    this.alertType = AlertType.None;
  }
}
