import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";
import { FacebookService, InitParams, LoginResponse, LoginOptions } from "ngx-facebook";
import { Observable, Subject } from 'rxjs';
import { MzToastService } from 'ng2-materialize';
import "rxjs/add/operator/toPromise";

@Injectable()
export class LoginService {

  public fbService: FacebookService;
  public fbProfile: any = null;
  public userProfile: any = null;

  public fbToken: any = null;
  public jwtToken: any = null;
  private http: Http;
  
  private loggedIn = new Subject<boolean>();

  private options: LoginOptions = {
    scope: "public_profile, user_friends, email",
    return_scopes: true,
    enable_profile_selector: true
  };

  constructor(fbService: FacebookService, private toastService: MzToastService, http: Http) { 
    this.fbService = fbService;
    this.http = http;

    this.fbProfile = JSON.parse((<any>window).localStorage.getItem("fbProfile"));
    this.userProfile = JSON.parse((<any>window).localStorage.getItem("userProfile"));
    this.fbToken = (<any>window).localStorage.getItem("fbToken");
    this.jwtToken = (<any>window).localStorage.getItem("jwtToken");

    if (this.fbProfile !== null && this.userProfile !== null && this.fbToken !== null && this.jwtToken !== null) {
      this.loggedIn.next(true);
    }

    let initParams: InitParams = {
      appId: "113701052652102",
      xfbml: true,
      version: "v2.8",
      status: true
    };

    this.fbService.init(initParams);
    (<any>window).loginService = this;
  }

  getProfile() {
    if (this.userProfile === null || this.fbProfile === null) {
      return null;
    } else {
      return {
        nusreviews: this.userProfile,
        facebook: this.fbProfile
      };
    }
  }

  toggleFacebookLogin() {
    if (this.fbProfile === null || this.userProfile === null) {
      this.loginWithFacebook();
    } else {
      this.logoutFromFacebook();
    }
  }

  secureApiGet(url: string) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + this.jwtToken);
    return this.http.get(url, {
      headers: headers
    }).toPromise();
  }

  secureApiPost(url: string, body: string) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + this.jwtToken); 
    headers.append("Content-Type", "application/json");
    return this.http.post(url, body, {
      headers: headers
    }).toPromise();
  }

  secureApiDelete(url: string) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + this.jwtToken); 
    return this.http.delete(url, {
      headers: headers
    }).toPromise();
  }

  loginWithFacebook() {
    this.fbService.login(this.options).then((response: LoginResponse) => {
      this.fbToken = response.authResponse.accessToken;
      (<any>window).localStorage.setItem("fbToken", this.fbToken);
      return this._fetchFacebookProfile();
    }).then((fbProfile) => {
      return this._generateServerTokens(this.fbToken, this.fbProfile);
    }).then((response) => {
      let jwtToken = response.json()["token"];
      this.jwtToken = jwtToken;
      (<any>window).localStorage.setItem("jwtToken", jwtToken);
      return this._fetchNusreviewsProfile();
    }).then((response) => {
      let responseJson = response.json();
      this.userProfile = responseJson.user;
      this.loggedIn.next(true);
      this.showToast('You are logged in!', 3000, 'green');
    }).catch((error: any) => {
      console.error(error);
      this.logoutFromFacebook();
    });
  }

  logoutFromFacebook() {
    this.fbProfile = null;
    this.userProfile = null;
    this.fbToken = null;
    this.jwtToken = null;
    (<any>window).localStorage.setItem("fbProfile", null);
    (<any>window).localStorage.setItem("userProfile", null);
    (<any>window).localStorage.setItem("fbToken", null);
    (<any>window).localStorage.setItem("jwtToken", null);

    this.loggedIn.next(false);
    this.showToast('You have logged out!', 3000, 'red');
    this.fbService.logout().then(() => {
      // Nothing to do here
    }).catch((err) => {
      // Nothing to do here either
    });
  }

  getLoggedInObservable(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  _fetchNusreviewsProfile() {
    return this.secureApiGet("https://api.nusreviews.com/profile").then((res) => {
      this.userProfile = res;
      (<any>window).localStorage.setItem("userProfile", JSON.stringify(res.json().user));
      return this.userProfile;
    }).catch((err) => {
      console.error(err);
    });
  }

  _fetchFacebookProfile() {
    return this.fbService.api("/me?fields=id,email,name,picture").then((res) => {
      this.fbProfile = res;
      (<any>window).localStorage.setItem("fbProfile", JSON.stringify(res));
      return this.fbProfile;
    }).catch((err) => {
      console.error(err);
    });
  }

  _generateServerTokens(fbToken: string, fbProfile: any) {
    let url = "https://api.nusreviews.com/generateServerToken";
    let query = "?fbToken=" + fbToken +
                "&email=" + fbProfile.email +
                "&name=" + fbProfile.name + 
                "&fid=" + fbProfile.id;

    return this.http.get(url + query).toPromise();
  }


  private showToast(msg, time, color) {
    this.toastService.show(msg, time, color);
  }
}
