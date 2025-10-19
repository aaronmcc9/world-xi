import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/api/api.service";
import { PagedResponseDto } from "src/app/api/Common/paged-response.dto";
import { ServiceResponse } from "src/app/api/Common/service-response.dto";
import { Notification } from "src/app/api/User/Notification/notification.dto";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class NotificationApiService {

    private readonly url = environment.apiBaseUrl + "/notification/";
    constructor(private apiService: ApiService, private http: HttpClient) {

    }

    fetchNotifications(skip?: number, take?: number): Observable<ServiceResponse<PagedResponseDto<Notification[]>>> {
        return this.http.get<ServiceResponse<PagedResponseDto<Notification[]>>>(this.url,
            { params: this.apiService.constructParams({ 'skip': skip, 'take': take }) })
    }

    updateNotification(notificationId: number, message?: string, isRead?: boolean, actionRequired?: boolean): Observable<ServiceResponse<Notification>> {
        return this.http.put<ServiceResponse<Notification>>(this.url, {},
            { params: this.apiService.constructParams({'notificationId': notificationId, 'message': message, 'isRead': isRead, 'actionRequired': actionRequired }) })
    }
}