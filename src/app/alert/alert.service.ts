import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { AlertType } from "./alert-type.enum";
import { Alert } from "./alert.model";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    alertSubscription = new Subject<Alert>();
    message = '';
    constructor(private translateService: TranslateService) { }

    toggleAlert(messageKey: string, alertType: AlertType, errorMessage?: string,
        messageParams?: {}) {

        if (messageKey) {
            this.message = messageParams ? this.translateService.instant(messageKey, messageParams) :
             this.translateService.instant(messageKey);

            if (errorMessage)
                this.message = this.message + ' ' + errorMessage;
            //closes alert
            setTimeout(() => {
                this.toggleAlert('', AlertType.None);
            }, 7000)
        }


        this.alertSubscription.next(new Alert(this.message, alertType));
        this.message = '';
    }
}