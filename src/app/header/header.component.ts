import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopUpComponent } from '../login-pop-up/login-pop-up.component';
import { RegisterPopUpComponent } from '../register-pop-up/register-pop-up.component';
import { UserService } from "../_services/user.service";
import { AuthService } from '../auth/auth.service';
import { User } from '../user';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

@Injectable({
    providedIn: 'root',
})
export class HeaderComponent implements OnInit {
  name: string;
  surname: string;
  email: string;
  password: string;
  public user: User;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,

  ) { }

  public userIsAuthorized(): boolean {
    return this.authService.userIsAuthorized()
  }

  openSignInDialog(): void {
    let dialogRef = this.dialog.open(LoginPopUpComponent, {
      width: '600px',
      height: '400px',
      data: {email: this.email, password: this.password}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.email = result.email;
        this.password = result.password;
      }
    });
  }

  openSignUpDialog(): void {
    let dialogRef = this.dialog.open(RegisterPopUpComponent, {
      width: '600px',
      height: '500px',
      data: {name: this.name,
             surname: this.surname,
             email: this.email,
             password: this.password}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.name = result.name;
        this.surname = result.surname;
        this.email = result.email;
        this.password = result.password;
      }
    });
  }

  clickToggle() {
    this.userService.toggleUserProfile();
  }

  closeProfile(){
    this.userService.closeUserProfile()
  }


    ngOnInit() {
    this.user = new User('','', 0, '', '');
    this.userService.getEmittedValue()
          .subscribe(item => this.user=item);
  }

}
