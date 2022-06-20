import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faFutbolBall } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLogin = true;
  form = new FormGroup({});  

  //icons
  ball = faFutbolBall;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {

    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required, Validators.minLength(8)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  onSubmit(){
    if(this.isLogin){
      this.authService.login(this.form.value.email, this.form.value.password);
    }
    else{
      this.authService.createAccount(this.form.value.email, this.form.value.password)
    }
  }

  onSwitchMode(){
    this.isLogin = !this.isLogin;
  }

}
