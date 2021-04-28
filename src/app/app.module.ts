import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { PublicContainerComponent } from './components/public/container/public-container/public-container.component';
import { ForgotPasswordComponent } from './components/public/forgot-password/forgot-password.component';
import { LoginComponent } from './components/public/login/login.component';
import { SignupComponent } from './components/public/signup/signup.component';
import { PrivateContainerComponent } from './components/private/container/private-container/private-container.component';
import { DashboardComponent } from './components/private/dashboard/dashboard.component';
import { ProfileComponent } from './components/private/profile/profile.component';
import { AddFriendComponent } from './components/private/add-friend/add-friend.component';
@NgModule({
  declarations: [
    AppComponent,
    PublicContainerComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    PrivateContainerComponent,
    DashboardComponent,
    ProfileComponent,
    AddFriendComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SocialLoginModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '448774167684-l4u6hip14o5v0dmi7prqe14bg3nehg8i.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
