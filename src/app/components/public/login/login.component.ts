import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Login, LoginWithGoogle } from '../../models/login.model';
import { DataService } from '../service/data.service';
import { Guid } from 'guid-typescript';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { StaticData } from 'src/app/shared/constants/constant';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm = this.initForm();
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notifyService: NotificationService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private authService: SocialAuthService
  ) {}

  // tslint:disable-next-line:typedef
  private initForm() {
    return this.fb.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }
  // tslint:disable-next-line:typedef
  public login() {
    if (this.loginForm.invalid) {
      return;
    }
    const loginWrapper = new Login();
    loginWrapper.email = this.loginForm.value.userName;
    loginWrapper.deviceToken = Guid.create().toString();
    loginWrapper.deviceType = StaticData.DeviceType;
    loginWrapper.password = this.loginForm.value.password;
    loginWrapper.longitude = localStorage.getItem('latitude');
    loginWrapper.latitude = localStorage.getItem('longitude');

    this.dataService.login(loginWrapper).subscribe((result) => {
      if (result && result.message === 'Success') {
        this.notifyService.showSuccess('Success', '');
        sessionStorage.setItem(
          'loggedInUser',
          JSON.stringify(result.data.customerData)
        );
        this.router.navigateByUrl('/dashboard');
      } else {
        this.notifyService.showWarning(result.message, '');
      }
    });
  }

  // tslint:disable-next-line:typedef
  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        const loginWrapper = new LoginWithGoogle();
        loginWrapper.email = user.email;
        loginWrapper.deviceToken = Guid.create().toString();
        loginWrapper.deviceType = StaticData.DeviceType;
        loginWrapper.googleId = user.id;
        loginWrapper.longitude = localStorage.getItem('latitude');
        loginWrapper.latitude = localStorage.getItem('longitude');
        this.dataService.loginWithGoogle(loginWrapper).subscribe((result) => {
          if (result && result.message === 'Success') {
            this.notifyService.showSuccess('Success', '');
            sessionStorage.setItem(
              'loggedInUser',
              JSON.stringify(result.data.customerData)
            );
            this.router.navigateByUrl('/dashboard');
          } else {
            this.notifyService.showWarning(result.message, '');
          }
        });
      } else {
        this.notifyService.showError(
          'There is some error while getting response from google',
          'Error'
        );
      }
    });
  }
}
