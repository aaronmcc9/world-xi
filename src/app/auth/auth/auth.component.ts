import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFutbolBall } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { AlertType } from 'src/app/alert/alert-type.enum';
import { AlertService } from 'src/app/alert/alert.service';
import { AuthApiService } from 'src/app/api/auth/auth-api.service';
import { ServiceResponse } from 'src/app/api/Common/service-response.dto';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface UserRequestDto {
  email: string,
  password: string
}

interface FormValue {
  email: FormControl<string>,
  password: FormControl<string>
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  error = '';
  isLogin = true;
  form!: FormGroup<FormValue>;

  //icons
  ball = faFutbolBall;

  constructor(private authService: AuthService, private router: Router,
    private authApiService: AuthApiService, private alertService: AlertService) { }

  ngOnInit(): void {

    this.form = new FormGroup<FormValue>({
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.email, Validators.required, Validators.minLength(8)]
      },),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5)]
      })
    });
  }

  onSubmit() {

    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }

    let authObservable: Observable<ServiceResponse<string>>;
    let user = this.getDto();


    if (this.isLogin) {
      authObservable = this.authApiService.login(user);
    }
    else {
      authObservable = this.authApiService.createAccount(user)
    }

    authObservable.subscribe({
      next: (res: ServiceResponse<string>) => {
        this.authService.setToken(res.data)
        this.router.navigate(['players']);
      },
      error: (res: HttpErrorResponse) => {
          this.alertService.toggleAlert('', AlertType.Danger, res.error.message)
      }
    })

    this.form.reset();
  }

  onSwitchMode() {
    this.isLogin = !this.isLogin;
  }

  private getDto(): UserRequestDto {
    let formValue = this.form.getRawValue();

    return {
      email: formValue.email,
      password: formValue.password
    } as UserRequestDto;
  }

}
