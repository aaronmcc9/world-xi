import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceResponse } from "../../Common/service-response.dto";
import { Formation } from "./formation.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class FormationApiService {

    private readonly url = environment.apiBaseUrl + "/formation/";

    constructor(private http: HttpClient) {
    }

    fetchAllFormations(): Observable<ServiceResponse<Formation[]>> {
        return this.http.get<ServiceResponse<Formation[]>>(this.url);
    }
}