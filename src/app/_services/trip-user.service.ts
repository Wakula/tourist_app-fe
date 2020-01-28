import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { BASE_URL } from './config'
import { catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';


@Injectable({
  providedIn: 'root'
})
export class TripUserService {

  private tripUrl = BASE_URL + '/trip/v1/trip';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorService: ErrorService,
    ) { }

  getTripUsers(trip_id): Observable<any> {
    const url = `${this.tripUrl}/${trip_id}?fields=users`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.get(url, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
    
  }

  deleteTripUser(trip_id, user_id): Observable<any> {
    const url = `${BASE_URL}/user/v1/user?trip_id=${trip_id}&user_id=${user_id}`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.delete(url, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  toggleRole(role_id, user_id): Observable<any> {
    const url = `${BASE_URL}/role/v1/role/${role_id}`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.put(url, {'user_id': user_id}, {headers: header, observe: 'response'})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

}
