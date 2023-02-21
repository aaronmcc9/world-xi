import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/api/api.service";
import { ServiceResponse } from "src/app/api/Common/service-response.dto";
import { Notification } from "src/app/api/User/Notification/notification.dto";

@Injectable({
    providedIn: 'root'
})
export class NotificationApiService {

    private readonly url = "https://localhost:7258/api/notification/";
    constructor(private apiService: ApiService, private http: HttpClient) {

    }

    fetchNotifications(skip?: number, take?: number): Observable<ServiceResponse<Notification[]>> {
        return this.http.get<ServiceResponse<Notification[]>>(this.url,
            { params: this.apiService.constructParams({ 'skip': skip, 'take': take }) })
    }

    updateNotification(notificationId: number, message?: string, isRead?: boolean, actionRequired?: boolean): Observable<ServiceResponse<Notification>> {
        return this.http.put<ServiceResponse<Notification>>(this.url, {},
            { params: this.apiService.constructParams({'notificationId': notificationId, 'message': message, 'isRead': isRead, 'actionRequired': actionRequired }) })
    }
}