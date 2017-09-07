import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  public loginService: LoginService;
  isLoggedIn: Subscription;

  constructor(loginService: LoginService) { 
    this.loginService = loginService;
    this.isLoggedIn = this.loginService.getLoggedInObservable().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        //console.log('is logged in!');
      } else {
        //console.log('has logged out!');
      }
    });
  }

  ngOnInit() {
    (<any>window).userLogin = this;
    // if (this.loginService.getProfile()) {
    //   console.log(this.loginService.getProfile().nusreviews);
    // }
    this
  }

  toggleFacebookLogin() {
    this.loginService.toggleFacebookLogin();
  }
}
