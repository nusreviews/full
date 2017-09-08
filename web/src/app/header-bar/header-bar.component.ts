import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavOption } from '../navOption';
import { LoginService } from '../login.service';
import { Subscription } from 'rxjs';
import { UserLoginComponent } from '../user-login/user-login.component';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {
  
  public appName: string = "NUS REVIEWS";
  isLoggedIn: boolean = false;
  isLoggedInSubscription: Subscription;
  
  constructor(private router: Router, private loginService: LoginService,) {
    this.router = router;
    this.loginService = loginService;
    this.isLoggedInSubscription = this.loginService.getLoggedInObservable().subscribe(isLoggedIn => {
      //console.log(isLoggedIn);
      this.isLoggedIn = isLoggedIn;
    });
  }
  
  ngOnInit() {
    $(".button-collapse").sideNav();

    // Check if user is logged in first, as Reactive does not detect inital states
    this.isLoggedIn = this.loginService.getProfile() != null;
  }
  
  redirectHome() {
    this.router.navigate(['/dashboard']);
  }
  
  onLoginClick() {
    //console.log("Login!");
    this.loginService.toggleFacebookLogin();
  }
  
  onLogoutClick() {
    //console.log("Logout!");
    this.loginService.toggleFacebookLogin();
  }
  
  onProfileClick(){
    //console.log("Go to Profile!");
    this.router.navigate(['/user/' + this.loginService.getProfile().nusreviews.userId]);
  }

  getProfilePicture() {
    return this.loginService.getProfile().facebook.picture.data.url
  }

  getUsername() {
    return this.loginService.getProfile().facebook.name;
  }
  
}
