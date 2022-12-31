import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceResponse } from "src/app/service-response.model";
import { Formation } from "./formation.model";

@Injectable({
    providedIn: 'root'
})
export class FormationApiService {

    private readonly url = "https://localhost:7258/api/formation/"

    constructor(private http: HttpClient) {
    }

    fetchAllFormations(): Observable<ServiceResponse<Formation>> {
        return this.http.get<ServiceResponse<Formation>>(this.url);
    }
}