import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/shared/api/http.service';
import { RearGuardAPImethod } from 'src/app/shared/constants/constant';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SignUp } from '../../models/signup.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Login, LoginWithGoogle } from '../../models/login.model';
import { AuthService } from 'src/app/shared/api/auth.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private baseUrl = environment.rearGuardApiBaseUri;
  private rearGuradNetBaseUri = environment.rearGuradNetBaseUri;
  private baseUrlWithoutVersion = environment.rearGuardBaseUri;

  private userDetails: any;

  constructor(
    private httpService: HttpService,
    private notifyService: NotificationService,
    private authService: AuthService
  ) {}
  // tslint:disable-next-line:typedef
  private handleError(error: HttpErrorResponse) {
    this.notifyService.showError(error.error.message, 'Error');
  }
  private getAccessToken(): any {
    this.userDetails = this.authService.getloggedUserDetails();
    if (this.userDetails && this.userDetails.accessToken) {
      return this.userDetails.accessToken;
    }
  }
  public getHeaders(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }
  public getHeaderswithAuthorization(): any {
    console.log(this.getAccessToken());
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: this.getAccessToken(),
      }),
    };
  }
  public getHeadersForImageupload(): any {
    return {
      headers: new HttpHeaders({
        'content-type':
          'multipart/form-data; boundary=----WebKitFormBoundaryrOnde5GXhsGJe1AS',
        authorization: this.getAccessToken(),
      }),
    };
  }
  //#region SignUp API
  signup(signuUp: SignUp): any {
    const signupUrl = `${this.baseUrl}${RearGuardAPImethod.registration}`;
    return this.httpService.post(signupUrl, signuUp, this.getHeaders()).pipe(
      catchError((error) => {
        if (
          error.status === 401 ||
          error.status === 403 ||
          error.status === 400
        ) {
          // handle error
          this.handleError(error);
        }
        return throwError(error);
      })
    );
  }
  //#endregion
  //#region Login API
  login(login: Login): any {
    const loginUrl = `${this.baseUrl}${RearGuardAPImethod.login}`;
    return this.httpService.post(loginUrl, login, this.getHeaders()).pipe(
      catchError((error) => {
        if (
          error.status === 401 ||
          error.status === 403 ||
          error.status === 400
        ) {
          // handle error
          this.handleError(error);
        }
        return throwError(error);
      })
    );
  }
  //#endregion
  //#region Upload Profile Pic
  uploadProfilePic(imageData: any): any {
    const name = imageData.get('document').name;
    const imageUploadUrl = `${this.baseUrl}${RearGuardAPImethod.uploadsProfilePic}`;
    const payload =
      '------WebKitFormBoundaryrOnde5GXhsGJe1AS\r\n' +
      'Content-Disposition: form-data; name="document"; filename="' +
      name +
      '"\r\n' +
      'Content-Type: image/jpeg\r\n' +
      '\r\n' +
      '\r\n' +
      '------WebKitFormBoundaryrOnde5GXhsGJe1AS--\r\n';

    return this.httpService
      .post(imageUploadUrl, payload, this.getHeadersForImageupload())
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
  //#endregion

  //#region Forgot Password
  forgotPassword(email: string): any {
    return this.httpService
      .post(
        'https://rearguarddating.devdevelopment.net/api/Customer/sendforgotemail',
        email,
        this.getHeaders()
      )
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
  //#endregion

  //#region Login API
  loginWithGoogle(loginWithGoogle: LoginWithGoogle): any {
    const loginwithGoogleUrl = `${this.baseUrl}${RearGuardAPImethod.loginWithGoogle}`;
    return this.httpService
      .post(loginwithGoogleUrl, loginWithGoogle, this.getHeaders())
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
  //#endregion

  ////#region Update Profile Data
  saveProfileDate(profileData): any {
    const saveProfileDataUrl = `${this.baseUrl}${RearGuardAPImethod.saveProfileData}`;
    return this.httpService
      .post(saveProfileDataUrl, profileData, this.getHeaderswithAuthorization())
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
  //#endregion
  ////#region Update Profile Data
  searchFriend(searchData): any {
    const searchDataUrl = `${this.baseUrlWithoutVersion}${RearGuardAPImethod.searchData}`;
    return this.httpService
      .post(searchDataUrl, searchData, this.getHeaderswithAuthorization())
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
  //#endregion
  //#region Sent Friend request
  sendFriendRequest(friendRequestData): any {
    const friendRequestUrl = `${this.baseUrlWithoutVersion}${RearGuardAPImethod.sendFriendRequest}`;
    return this.httpService
      .post(
        friendRequestUrl,
        friendRequestData,
        this.getHeaderswithAuthorization()
      )
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
  //#endregion

  //#region get sent Friend request
  getFriendRequest(friendRequestData): any {
    const friendRequestUrl = `${this.baseUrlWithoutVersion}${RearGuardAPImethod.getInvitations}`;
    return this.httpService
      .post(
        friendRequestUrl,
        friendRequestData,
        this.getHeaderswithAuthorization()
      )
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
  //#endregion
  //#region LogOut
  logout(): any {
    const logouturl = `${this.baseUrlWithoutVersion}${RearGuardAPImethod.logout}`;
    return this.httpService
      .put(logouturl, {}, this.getHeaderswithAuthorization())
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
  //#endregion
  //#region LogOut
  friendSuggestions(): any {
    const friendSuggestions = `${this.rearGuradNetBaseUri}${RearGuardAPImethod.friendSuggestion}`;
    return this.httpService
      .post(friendSuggestions, { authorization: this.getAccessToken() }, {})
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
  //#endregion
  //#region Accept Friend request
  acceptFriendRequest(id): any {
    const acceptFriend = `${this.baseUrlWithoutVersion}${RearGuardAPImethod.acceptFriendRequest}`;
    return this.httpService
      .post(
        acceptFriend,
        { userToId: id, status: 'Accepted' },
        this.getHeaderswithAuthorization()
      )
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
  //#endregion
  //#region Make User Friend to Admin
  MakeUserFriendWithAdmin(accessToken: string) {
    const friendWithAdmin = `${this.rearGuradNetBaseUri}${RearGuardAPImethod.friendWithAdmin}`;
    return this.httpService
      .post(friendWithAdmin, { authorization: accessToken }, {})
      .pipe(
        catchError((error) => {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          ) {
            // handle error
            this.handleError(error);
          }
          return throwError(error);
        })
      );
  }
}
