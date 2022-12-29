import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { User } from "./user.model";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    userLoggedIn = new BehaviorSubject<boolean>(false);
    private tokenExpirationEvent: any;

    constructor(private router: Router) { }

    logout() {
        this.removeToken();
        this.router.navigate(['/auth']);
        this.tokenExpirationEvent = null;
    }


    // autoLogout(expirationTime: number) {
    //     this.tokenExpirationEvent = setTimeout(() => {
    //         this.logout();
    //     }, expirationTime)
    // }

    setToken(accessToken: string) {
        localStorage.setItem('token', accessToken);
        this.userLoggedIn.next(true);
    }

    removeToken() {
        localStorage.removeItem('token');
        this.userLoggedIn.next(false);
    }

    isUserLoggedIn() {
        let tokenExists = !!localStorage.getItem('token');
        this.userLoggedIn.next(tokenExists);
        return tokenExists;
    }
}