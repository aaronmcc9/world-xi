import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFutbolBall } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { ServiceResponse } from 'src/app/service-response.model';
import { AuthResponseData, AuthService } from './auth.service';
import { User } from './user.model';

export interface UserRequestDto{
  email: string,
  password: string
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  error = '';
  isLogin = true;
  form = new UntypedFormGroup({});

  //icons
  ball = faFutbolBall;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.form = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.email, Validators.required, Validators.minLength(8)]),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  onSubmit() {

    if(!this.form.valid){
      this.form.markAsDirty();
      return;
    }
    
    let authObservable: Observable<ServiceResponse>;
    let user = this.getDto();


    if (this.isLogin) {
      authObservable = this.authService.login(user);
    }
    else {
      authObservable = this.authService.createAccount(user)
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

  private getDto(): UserRequestDto
  {
    let formValue = this.form.getRawValue();

    return {
      email: formValue.email,
      password: formValue.password
    } as UserRequestDto;
  }

}
