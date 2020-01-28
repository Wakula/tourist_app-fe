import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "../_services/user.service";
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(
      private router: Router,
      private userService: UserService,
      private authService: AuthService,
  ) { }

  public userIsAuthorized(): boolean {
    return this.authService.userIsAuthorized()
  }
  
  create_trip(){
    this.router.navigate(['/create_trip']);
    this.userService.closeUserProfile();
  }

  ngOnInit() {
  }

}
