import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AlertType } from "./alert-type.enum";
import { Alert } from "./alert.model";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    alertSubscription = new Subject<Alert>()

    toggleAlert(message: string, alertType: AlertType) {
        if (message) {
            //closes alert
            setTimeout(() => {
                this.toggleAlert('', AlertType.None);
            }, 7000)
        }

        this.alertSubscription.next(new Alert(message, alertType));
    }
}