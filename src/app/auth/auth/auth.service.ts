import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { ServiceResponse } from "src/app/service-response.model";
import { UserRequestDto } from "./auth.component";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private readonly url = "https://localhost:7258/api/auth"
    user = new BehaviorSubject<User | null>(null);
    private tokenExpirationEvent: any;

    constructor(private http: HttpClient, private router: Router) { }

    createAccount(user:UserRequestDto) {
        return this.http.post<ServiceResponse>(this.url + "/register", user)
            .pipe(catchError((error: HttpErrorResponse) => throwError(error.message)),
                tap((res:ServiceResponse) => {
                    this.setUser(res.data);
                }));
    }

    login(user:UserRequestDto) {
        return this.http.post<ServiceResponse>(this.url + "/login", user)
            .pipe(catchError((error: HttpErrorResponse) => throwError(error.message)),
                tap((res:ServiceResponse) => {
                    this.setUser(res.data);
                }));
    }

    logout() {
        localStorage.removeItem('user');
        this.user.next(null);

        this.router.navigate(['/auth']);
        this.tokenExpirationEvent = null;
    }

    // autoLogin() {
    //     const storedDetails = localStorage.getItem('user');

    //     if (storedDetails) {
    //         const userData: {
    //             email: string,
    //             id: string,
    //             _authToken: string,
    //             _expiresIn: string
    //         } = JSON.parse(storedDetails);

    //         const storedUser = new User(userData.email,
    //             userData.id,
    //             userData._authToken,
    //             new Date(userData._expiresIn));

    //         if (storedUser.authToken) {
    //             this.user.next(storedUser);

    //             const currentExpiryTime = new Date(userData._expiresIn).getTime()
    //                 - new Date().getTime();

    //             this.autoLogout(currentExpiryTime);
    //         }
    //     }
    // }

    // autoLogout(expirationTime: number) {
    //     this.tokenExpirationEvent = setTimeout(() => {
    //         this.logout();
    //     }, expirationTime)
    // }

    setUser(user: User) {
        // const expirationTime = new Date(new Date().getTime() + +response.expiresIn * 1000);

        // const userDetails = new User(
        //     response.email,
        //     response.id,
        //     response.authToken,
        //     expirationTime
        // );

        // localStorage.setItem('user', JSON.stringify(userDetails));
        // this.autoLogout(+response.expiresIn * 1000)
        this.user.next(user);
    }

    getCurrentUserId(): string | undefined {
        return this.user.getValue()?.id;
    }
}