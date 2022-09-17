import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFutbolBall } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  error = '';
  isLogin = true;
  form = new FormGroup({});

  //icons
  ball = faFutbolBall;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required, Validators.minLength(8)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  onSubmit() {

    let authObservable: Observable<AuthResponseData>;

    if (this.isLogin) {
      authObservable = this.authService.login(this.form.value.email, this.form.value.password);
    }
    else {
      authObservable = this.authService.createAccount(this.form.value.email, this.form.value.password)
    }

    authObservable.subscribe({
      next: responseData => {
        this.router.navigate(['players']);
      },
      error: errorMessage => {
        this.error = errorMessage;
      }
    })

    this.form.reset();
  }

  onSwitchMode() {
    this.isLogin = !this.isLogin;
  }

}
