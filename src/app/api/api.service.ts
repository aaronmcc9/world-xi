import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructParams(params: object): HttpParams {
        let httpParams = new HttpParams();
        for (const [key, value] of Object.entries(params)) {

            if (typeof value == typeof undefined || typeof value == typeof null)
                continue

            httpParams = httpParams.append(key, value)
        }
        return httpParams;
    }
}