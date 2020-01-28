import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ErrorService } from './error.service';
import { BASE_URL } from './config'
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private newRoleSource = new BehaviorSubject(null);
  newRole = this.newRoleSource.asObservable();

  setNewRole(role) {
    this.newRoleSource.next(role);
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorService: ErrorService,
  ) { }

  getTripRoles(trip_id: number): Observable<any> {
    const url = BASE_URL + `/trip/v1/trip/${trip_id}?fields=roles`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.get(url, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  addTripRole(data): Observable<any> {
    const url = BASE_URL + `/role/v1/role`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.post(url, data, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  getUserRoles(trip_id): Observable<any> {
    const url = BASE_URL + `/user/v1/user?fields=roles&trip_id=${trip_id}`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.get(url, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  deleteTripRole(role_id): Observable<any> {
    const url = BASE_URL + `/role/v1/role/` + role_id;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.delete(url, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }
}
