import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators} from '@angular/forms';
import { UserService } from '../_services/user.service'
import { AuthService } from '../auth/auth.service';
import { AuthService as SocialAuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Subscription } from 'rxjs';


export interface DialogData {
 email: string;
 password: string;
}

@Component({
  selector: 'app-login-pop-up',
  templateUrl: './login-pop-up.component.html',
  styleUrls: ['./login-pop-up.component.css']
})


export class LoginPopUpComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8), 
    Validators.pattern(RegExp('(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z\\d]'))]);
  passwordHide = true;
  sessionId: string;
  authServiceSubscription: Subscription;
  loginSubscription: Subscription;

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  getPasswordErrorMessage(){
    return this.password.hasError('required') ? 'You must enter a value' :
        this.password.hasError('minlength') ? 'Password should be at least 8 characters':
        this.password.hasError('pattern') ? 'Password must contain at least 1 digit and 1 character':
            '';
  }

  dataInvalid(): boolean{
    return (this.email.invalid || this.password.invalid);
  }

  logInUser(type?: string) {
    // Pass if user already authorized
    if(this.authService.userIsAuthorized()){
        return;
    }
    // if type was not passed into a function
    if(type === undefined){
        this.subscribeOnLogin(this.data);
        // if type was passed
    } else if(type == "facebook"){
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    } else if(type == "google"){
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }
  }

    private getSocialData(user){
        return {'auth_token': user.authToken, 'provider': user.provider}
        }

  subscribeOnLogin(data, type?) {
    // Create subscription on login request
    this.loginSubscription = this.authService.userLogin(data)
    .subscribe(res => {
      this.authService.setSessionId(res.body.data.session_id, res.body.data.user_id);
      this.userService.refreshUser();
      this.dialogRef.close();
      this.router.navigate(['trip-list']);

      // Unsubscribe after user logged in
      this.closeLoginSubscriptions();
    });
  }

  private closeLoginSubscriptions(){
    /* Close all subscriptions to avoid subscription 
    duplicates and memory leaks after next login */
    this.loginSubscription.unsubscribe();
    this.authServiceSubscription.unsubscribe();
  }

  constructor(
    public dialogRef: MatDialogRef<LoginPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
  ){ }

  ngOnInit() {
    // Create subscription on AuthService state
    this.authServiceSubscription = this.socialAuthService.authState.subscribe((user) => {
      // check if authentication is successful (returns user) and user is not authorized
      if ((user != null) && !this.authService.userIsAuthorized()){
        this.subscribeOnLogin(this.getSocialData(user), 'type');
        // Sign out from social service after user data was sent
        this.socialAuthService.signOut();
      }
    });
  }
}

