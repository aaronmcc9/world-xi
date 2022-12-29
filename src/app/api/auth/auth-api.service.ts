import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserRequestDto } from "src/app/auth/auth/auth.component";
import { ServiceResponse } from "src/app/service-response.model";

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private readonly url = "https://localhost:7258/api/auth"

    constructor(private http: HttpClient) { }

    createAccount(user: UserRequestDto): Observable<ServiceResponse<string>> {
        return this.http.post<ServiceResponse<string>>(this.url + "/register", user)
    }

    login(user: UserRequestDto): Observable<ServiceResponse<string>> {
        return this.http.post<ServiceResponse<string>>(this.url + "/login", user);
    }

}