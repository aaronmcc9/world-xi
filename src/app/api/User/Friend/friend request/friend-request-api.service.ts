import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceResponse } from "src/app/api/Common/service-response.dto";
import { FriendRequest } from "./friend-request.dto";

@Injectable({
    providedIn: 'root'
})
export class FriendRequestApiService{

    private readonly url = "https://localhost:7258/api/friendrequest/"

    constructor(private http: HttpClient){

    }

    createFriendRequest(friendRequest:FriendRequest): Observable<ServiceResponse<string>>{
        return this.http.post<ServiceResponse<string>>(this.url, friendRequest);
    }

    updateFriendRequest(friendRequest:FriendRequest): Observable<ServiceResponse<string>>{
        return this.http.put<ServiceResponse<string>>(this.url, friendRequest);
    }
}