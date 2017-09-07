import { Component, OnInit } from '@angular/core';
import { MzBaseModal } from 'ng2-materialize';
import { LoginService } from '../login.service';

@Component({
  selector: 'fb-login-modal',
  templateUrl: './fb-login-modal.component.html',
  styleUrls: ['./fb-login-modal.component.css']
})
export class FbLoginModalComponent extends MzBaseModal implements OnInit {

  constructor(private loginService: LoginService) {
    super();
  }

  ngOnInit() {

  }

  loginFacebook() {
    this.loginService.toggleFacebookLogin();
  }
}
