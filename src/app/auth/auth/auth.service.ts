import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
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
    user = new BehaviorSubject<User | null>(null);
    private tokenExpirationEvent: any;

    constructor(private http: HttpClient, private router: Router) { }

    createAccount(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDKyc23Rs0uQU929aLOhlFw3mEtSrFgsts',
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError((error: HttpErrorResponse) => throwError(error.message)),
                tap(user => {
                    this.setUser(user);
                }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDKyc23Rs0uQU929aLOhlFw3mEtSrFgsts',
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError((error: HttpErrorResponse) => throwError(error.message)),
                tap(user => {
                    this.setUser(user);
                }));
    }

    logout(){
        localStorage.removeItem('user');
        this.user.next(null);

        this.router.navigate(['/auth']);
        this.tokenExpirationEvent = null;
    }

    autoLogin() {
        const storedDetails = localStorage.getItem('user');

        if (storedDetails) {
            const userData: {
                email: string,
                id: string,
                _authToken: string,
                _expiresIn: string
            } = JSON.parse(storedDetails);

            const storedUser = new User(userData.email,
                userData.id,
                userData._authToken,
                new Date(userData._expiresIn));

            if(storedUser.authToken){
                this.user.next(storedUser);

                const currentExpiryTime = new Date(userData._expiresIn).getTime() 
                    - new Date().getTime();
                
                this.autoLogout(currentExpiryTime);
            }
        }
    }

    autoLogout(expirationTime: number) {
         this.tokenExpirationEvent = setTimeout(() =>{
            console.log("here", expirationTime);
            this.logout();
        }, expirationTime)
    }

    setUser(response: AuthResponseData) {
        const expirationTime = new Date(new Date().getTime() + +response.expiresIn * 1000);

        const userDetails = new User(
            response.email,
            response.localId,
            response.idToken,
            expirationTime
        );

        localStorage.setItem('user', JSON.stringify(userDetails));
        this.autoLogout(+response.expiresIn * 1000)
        this.user.next(userDetails);

    }

}