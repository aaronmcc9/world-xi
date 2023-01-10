import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructParams(params: object): HttpParams {
        let httpParams = new HttpParams();

        let k: keyof typeof params;
        for (const [key, value] of Object.entries(params)) {

            if (typeof value == undefined || typeof value == null)
                continue;

            httpParams.set(key, value)
        }

        return httpParams;
    }
}