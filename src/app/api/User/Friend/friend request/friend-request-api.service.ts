import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/api/api.service";
import { ServiceResponse } from "src/app/api/Common/service-response.dto";
import { Notification } from "../../Notification/notification.dto";
import { FriendRequest } from "./friend-request.dto";
import { UpdateFriendRequest } from "./update-friend-request.dto";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class FriendRequestApiService{

    private readonly url = environment.apiBaseUrl + "/friendrequest/"

    constructor(private http: HttpClient, private apiService: ApiService){

    }

    createFriendRequest(friendRequest:FriendRequest): Observable<ServiceResponse<string>>{
        return this.http.post<ServiceResponse<string>>(this.url, friendRequest);
    }

    updateFriendRequest(friendRequest:UpdateFriendRequest, notificationId:number): Observable<ServiceResponse<Notification>>{
        return this.http.put<ServiceResponse<Notification>>(this.url, friendRequest,
            {params : this.apiService.constructParams({'notificationId': notificationId })});
    }
}