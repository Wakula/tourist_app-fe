import { Component, OnInit, ViewChild, Injectable, OnDestroy} from '@angular/core';
import { UserService} from "../_services/user.service";
import { Router} from "@angular/router";
import { MatSidenav} from "@angular/material/sidenav";
import { User} from '../user';
import { FormControl, Validators, FormGroup} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpEventType} from "@angular/common/http";
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

@Injectable({
  providedIn: 'root',
})
export class UserProfileComponent implements OnInit {

  private profileSubscription: Subscription = new Subscription();
  calculateFormOpened = false;
  passwordFormOpened = false;
  result: number;
  gender: string;
  userDataIsIncorrect: boolean;
  editable: boolean;


  surnameFormControl = new FormControl('', [Validators.minLength(2), Validators.maxLength(30)]);
  nameFormControl = new FormControl('', [Validators.minLength(2), Validators.maxLength(30), Validators.required]);
  capacityControl = new FormControl('', [Validators.min(1), Validators.max(40), Validators.required]);
  userGender = new FormControl('', Validators.required);
  userHeight = this.getUserFormControl();
  userWeight = this.getUserFormControl();
  oldPassword = this.getPasswordFormControl();
  newPassword = this.getPasswordFormControl();
  confirmPassword = this.getPasswordFormControl();
  passswordGroup = new FormGroup({first: this.newPassword,
    second: this.confirmPassword}, this.passwordMatchValidator);

  @ViewChild('sidenav', {static: true}) public userSideNav: MatSidenav;
  public user;
  public editedUser = new User('','', 0, '', '');

  private getUserFormControl(){
      return new FormControl('', [Validators.required,
        Validators.pattern("^(?:[1-9][0-9]{2}|[1-9][0-9]|[1-9])$")]);
  }

  private getPasswordFormControl(){
      return new FormControl('', [Validators.required, Validators.minLength(8),
            Validators.pattern(RegExp('(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z\\d]'))]);
  }

  private passwordMatchValidator(g: FormGroup) {
      return g.get('first').value === g.get('second').value
          ? null : {'mismatch': true};
  }


  changeCapacity(): void {
    let delta = this.userGender.value === "male" ? 4 : 0;

    this.result = ((this.userWeight.value * 0.3) + ((this.userHeight.value-100)/5) + delta) / 2;
    this.editedUser.capacity = this.result;

    if (this.result < 0) {
      alert("New capacity less then zero. Check your inputs.");
    } else {
      this.userService.updateCapacity({'capacity': this.result})
      .subscribe(() => this.userService.refreshUser());
      this.calculateFormOpened = false;
    }
  }

  updatePassword(){
    let data = {};
    if(this.oldPassword.value !== null){
      data = {'old_password': this.oldPassword.value};
    }
    data['new_password'] = this.newPassword.value;
    this.userService.updatePassword(data)
    .subscribe(() => {
      this.userService.refreshUser();
      alert('Password was changed');
    });
    this.clearPasswordForm();
  }

  private clearPasswordForm(){
    this.passwordFormOpened = false;
    this.resetPasswordFields();
  }

  private resetPasswordFields(){
    this.oldPassword.reset();
    this.newPassword.reset();
    this.confirmPassword.reset();
  }

  private resetCapacityFields(){
    this.userGender.reset();
    this.userHeight.reset();
    this.userWeight.reset();
  }

  toggleCalculateForm(){
    this.calculateFormOpened = !this.calculateFormOpened;
    this.resetCapacityFields();
  }

  togglePasswordForm(){
    this.passwordFormOpened = !this.passwordFormOpened;
    this.resetPasswordFields();
  }

  getHeightErrorMessage() {
    return this.userHeight.hasError('required') ? 'Enter a number' :
        this.userHeight.hasError('pattern') ? 'Number from 1 to 999' :
            '';
  }

  getWeightErrorMessage() {
    return this.userWeight.hasError('required') ? 'Enter a number' :
        this.userWeight.hasError('pattern') ? 'Number from 1 to 999' :
            '';
  }

  getPasswordErrorMessage(password){
    return password.hasError('required') ? 'You must enter a value' :
        password.hasError('minlength') ? 'Min length is 8 characters':
        password.hasError('pattern') ? 'At least 1 digit and 1 character': ''
  }

  getPasswordGroupErrorMessage(password){
    return this.passswordGroup.hasError('mismatch') ? 'Passwords do not match.':
        this.getPasswordErrorMessage(password);
  }

  capacityDataInvalid(): boolean{
    return (this.userHeight.invalid
      || this.userWeight.invalid
      || this.userGender.invalid);
  }

  passwordDataInvalid(): boolean{
    return (this.newPassword.invalid
      || this.confirmPassword.invalid || this.passswordGroup.invalid);
  }

  logoutUser(): void {
    this.authService.userLogout()
      .subscribe(res => {
        this.authService.deleteSessionId();
        window.location.reload();
      });
  }

  private clearUser(){
    this.user = new User('','', 0, '', '');
    this.previewUrl = null;
  }

  numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
      }
      return true;
  }

  letterOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
        // console.log('charCode ', charCode);
      if ((charCode != 32) && (charCode != 39) && (charCode < 65 || charCode > 122 )) {
          return false;
      }
      return true;
  }

  editUser() {
    this.userService.startEditUser();
    this.previewUrl = this.user.avatar;
    this.editedUser.name = this.user.name;
    this.editedUser.surname = this.user.surname;
    this.editedUser.capacity = this.user.capacity;
  }

  submitUserData()
  {
    if (this.previewUrl!=this.user.avatar){
      this.userService.updateUserAvatar(this.fileData)
          .subscribe(res => {
            console.log(res);
            // this.uploadedFilePath = res.data.filePath;
          });
    }
    this.userService.stopEditUser();
    if(!this.editedUser.surname){this.editedUser.surname=''}
    this.userService.updateUser(this.editedUser.name, this.editedUser.surname, this.editedUser.capacity)
        .subscribe(() => this.userService.refreshUser());
  }


  checkUserData()
  {
    let nameIsIncorect = this.nameFormControl.hasError('minlength')||
        this.nameFormControl.hasError('maxlength')||
        this.nameFormControl.hasError('required');
    let surnameIsCorrect = this.surnameFormControl.hasError('minlength')||
        this.surnameFormControl.hasError('maxlength');
    let capasityIsCorrect = this.capacityControl.hasError('min')||this.capacityControl.hasError('max')||this.capacityControl.hasError('required');
    this.userDataIsIncorrect = nameIsIncorect||surnameIsCorrect||capasityIsCorrect;
  }

  CancelEdit(){
    this.userService.stopEditUser();
    this.editedUser.name = this.user.name;
    this.editedUser.surname = this.user.surname;
    this.editedUser.capacity = this.user.capacity;
    this.previewUrl = this.user.avatar;
  }

  fileData: File = null;
  previewUrl:any = null;
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      console.log(this.previewUrl);
    }
  }

  constructor(
      private userService: UserService,
      private router: Router,
      private authService: AuthService,
      private http: HttpClient,
  ){ }

  ngOnInit() {
    this.clearUser();
    this.profileSubscription.add(this.userService.isUserProfileEditable
        .subscribe(status => {
          this.editable = status;
        }));
    this.userService.refreshUser();
    this.userService.setUserSideNav(this.userSideNav);
    this.profileSubscription.add(this.userService.getEmittedValue()
        .subscribe(item => this.user=item));
  }

  ngOnDestroy() {
    this.profileSubscription.unsubscribe();
  }

}
