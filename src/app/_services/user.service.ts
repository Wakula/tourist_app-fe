import { Injectable, EventEmitter, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {BehaviorSubject, Observable} from 'rxjs';
import {MatSidenav} from "@angular/material/sidenav";
import { BASE_URL } from './config'
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ErrorService } from './error.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = BASE_URL + '/user/v1/user';
  private changePasswordUrl = `${this.userUrl}`;
  private userAvatarUrl = `${this.userUrl}/avatar`;
  private confirmationUrl = BASE_URL + '/otc/v1/otc/';

  private userProfileEditable = new BehaviorSubject(false);
  isUserProfileEditable = this.userProfileEditable.asObservable();

  @Output() userDataEmitter: EventEmitter<any> = new EventEmitter();

  userSideNav: MatSidenav;

  setUserProfile(user){
    this.userDataEmitter.emit(user.data);
  }

  refreshUser(){
    if(this.authService.userIsAuthorized()){
      this.getUserProfile().subscribe(resp => {
        this.setUserProfile(resp.body);
      });
    }
  }

  getEmittedValue(){
    return this.userDataEmitter;
  }

  uuidConfirmation(uuid) {
    return this.http.patch(this.confirmationUrl + uuid, null);
  }

  postCredentials(data): Observable<any> {
    return this.http.post(this.userUrl, data)
    .pipe(
      catchError(this.errorService.handleError)
    );
  }

  getUserProfile() {
    let header = new HttpHeaders({'Authorization': localStorage.getItem('sessionId')});
    return this.http.get(this.userUrl, {headers: header, observe: 'response'})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  updateCapacity(capacity): Observable<any> {
    let header = new HttpHeaders({'Authorization': localStorage.getItem('sessionId')});
    return this.http.patch(this.userUrl, capacity, {headers: header, observe: 'response'})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  updatePassword(data): Observable<any> {
    let header = new HttpHeaders({'Authorization': localStorage.getItem('sessionId')});
    return this.http.patch(this.changePasswordUrl, data, {headers: header, observe: 'response'})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  updateUser(name, surname, capacity): Observable<any> {
      let header = new HttpHeaders({'Authorization': localStorage.getItem('sessionId')});
      const url = this.userUrl;
      return this.http.patch(url, {'name': name, 'surname': surname,'capacity': capacity}, {headers: header, observe: 'response'})
      .pipe(
          catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
      );
  }

  updateUserAvatar(avatar): Observable<any> {
    let header = new HttpHeaders({'Authorization': localStorage.getItem('sessionId')});
    const url = this.userAvatarUrl;
    const formData = new FormData();
    formData.append('file', avatar);
    return this.http.post(url, formData, {headers: header, observe: 'response'})
        .pipe(
            catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
        );
  }

  setUserSideNav(sideNav: MatSidenav){
    this.userSideNav = sideNav;
  }

  toggleUserProfile(){
    this.userSideNav.toggle();
    this.stopEditUser();
  }

  closeUserProfile(){
    this.userSideNav.close();
    this.stopEditUser();
  }

  startEditUser()
  {
    this.userProfileEditable.next(true);
  }

  stopEditUser()
  {
    this.userProfileEditable.next(false);
  }
  
  getUserId(): number {
    return Number(localStorage.getItem('userId'))
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorService: ErrorService,
  ) { }


}

