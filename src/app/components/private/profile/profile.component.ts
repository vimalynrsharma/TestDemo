import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/shared/api/auth.service';
import { MessageService } from 'src/app/shared/api/message.service';
import { StaticData } from 'src/app/shared/constants/constant';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Profile } from '../../models/signup.model';
import { DataService } from '../../public/service/data.service';
import { PrivateContainerComponent } from '../container/private-container/private-container.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;
  files = [];
  public userDetails: any;
  profileForm = this.initForm();
  public countryList: [];
  public genderList: [];
  public isEdit: boolean;
  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private messageService: MessageService
  ) {
    this.countryList = StaticData.countries;
    this.genderList = StaticData.Gender;
    this.isEdit = false;
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getloggedUserDetails();
    if (this.userDetails && this.userDetails.accessToken) {
    } else {
      this.router.navigateByUrl('/login');
    }
  }
  navigateToProfile() {
    this.router.navigateByUrl('/profile');
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      const file = fileUpload.files[0];
      this.sendFile(file);
    };
    fileUpload.click();
  }

  sendFile(file) {
    const formData = new FormData();
    formData.append('document', file);
    this.dataService.uploadProfilePic(formData).subscribe((result: any) => {
      if (result && result.message === 'Success') {
        this.notifyService.showSuccess('Success', '');
      } else {
        this.notifyService.showWarning(result.message, '');
      }
    });
  }
  editProfile() {
    this.isEdit = true;
    this.profileForm = this.fb.group({
      fullName: [this.userDetails.fullName],
      country: [this.userDetails.country],
      gender: [this.userDetails.gender],
      state: [this.userDetails.state],
      city: [this.userDetails.city],
      email: [this.userDetails.email],
      phoneNumber: [this.userDetails.phoneNumber],
    });
  }
  resetForm() {
    this.isEdit = false;
  }
  updateProfile() {
    const profile = new Profile();
    profile.fullName = this.profileForm.value.fullName;
    profile.about = '';
    profile.city = this.profileForm.value.city;
    profile.state = this.profileForm.value.state;
    profile.country = this.profileForm.value.country;
    profile.gender = this.profileForm.value.gender;
    profile.phoneNumber = this.profileForm.value.phoneNumber;
    this.dataService.saveProfileDate(profile).subscribe((result) => {
      if (result && result.message === 'Success') {
        this.notifyService.showSuccess('Success', '');
        sessionStorage.setItem(
          'loggedInUser',
          JSON.stringify(result.data.customerData)
        );
        this.isEdit = false;
        this.bindDetails();
        this.messageService.sendMessage(true);
      } else {
        this.notifyService.showWarning(result.message, '');
      }
    });
  }
  private initForm() {
    return this.fb.group({
      fullName: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.maxLength(10)]],
    });
  }
  private bindDetails() {
    this.userDetails = this.authService.getloggedUserDetails();
  }
}
