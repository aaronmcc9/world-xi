import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";
import { User } from "./user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.authService.user.pipe(
            take(1),
            exhaustMap((user: User | null) => {
                
                if(!user){
                    return next.handle(req)
                }

                const modifiedRequest = req.clone({
                    params: new HttpParams()
                        .set('auth', user.authToken)
                })

                return next.handle(modifiedRequest);
            })
        )
    }

}