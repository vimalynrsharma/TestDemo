import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { AppComponent } from 'src/app/app.component';
import { DataService } from 'src/app/components/public/service/data.service';
import { AuthService } from 'src/app/shared/api/auth.service';
import { MessageService } from 'src/app/shared/api/message.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-private-container',
  templateUrl: './private-container.component.html',
  styleUrls: ['./private-container.component.css'],
})
export class PrivateContainerComponent implements OnInit {
  public userDetails: any;
  subscription: Subscription;
  public dropDownNavMenu: string;
  public dropDownNavMenuChild: string;

  // tslint:disable-next-line:member-ordering
  public static returned: Subject<any> = new Subject();
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private dataService: DataService,
    private notifyService: NotificationService
  ) {
    this.dropDownNavMenu = 'nav-item dropdown';
    this.dropDownNavMenuChild = 'dropdown-menu profile-dropdown';

    this.subscription = this.messageService
      .getMessage()
      .subscribe((message: boolean) => {
        if (message) {
          this.userDetails = this.authService.getloggedUserDetails();
        } else {
          // clear messages when empty message received
        }
      });
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
  showNavMenu() {
    if (this.dropDownNavMenu.indexOf('show') >= 0) {
      this.dropDownNavMenu = 'nav-item dropdown';
      this.dropDownNavMenuChild = 'dropdown-menu profile-dropdown';
    } else {
      this.dropDownNavMenu = 'nav-item dropdown show';
      this.dropDownNavMenuChild = 'dropdown-menu profile-dropdown show';
    }
  }
  logout() {
    this.dataService.logout().subscribe((result: any) => {
      if (result && result.message === 'Success') {
        this.notifyService.showSuccess('LogOut Successfully', '');
        sessionStorage.clear();
        this.router.navigateByUrl('/login');
      }
    });
  }
}
