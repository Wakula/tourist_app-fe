import { Injectable } from '@angular/core';
import { Trip, Checkpoint } from "src/app/trip";
import { Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { BASE_URL } from './config'
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})

export class TripService {
  public listOfCheckpoints : Checkpoint[] =[ ];

  public currentTrip: Trip = {
    name: 'Servise trip',
    start_date: 'Right now',
    description: 'inside service'
  };

  private tripUrl = BASE_URL + '/trip/v1/trip';  // URL to web api

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService,
    private errorService: ErrorService,
    ) { }

  createTrip(name, startDate, endDate, description){
    this.currentTrip.name = name;
    this.currentTrip.start_date = startDate;
    this.currentTrip.end_date = endDate;
    this.currentTrip.description = description;
    this.currentTrip.points = this.listOfCheckpoints;
    this.addTrip(this.currentTrip).subscribe(g => {
      this.router.navigate(['trip-list']);
      this.listOfCheckpoints = [];
    })
  }
  addCheckpointToList(lat,lng,name,orderNumber) {
    const newCheckpoint: Checkpoint = {
      order_number : orderNumber,
      name: name,
      latitude: lat,
      longitude: lng,};
    this.listOfCheckpoints.push(newCheckpoint);
  }

  updateCheckpointList(markerList)
  {
    this.listOfCheckpoints = [];
    for(let counter = 0; counter < markerList.length; counter++ )
    {
      let newPoint = {order_number : counter+1,
        name: markerList[counter].name,
        latitude: markerList[counter].lat,
        longitude: markerList[counter].lng};
      this.listOfCheckpoints.push(newPoint);
    }
  }


  addTrip(trip: Trip): Observable<any> {
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.post(this.tripUrl, trip, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }


  getTrip(trip_id: number): Observable<any> {
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    const url = `${this.tripUrl}/${trip_id}`;
    return this.http.get(url, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }


  getTrips(): Observable<any> {
    const tripListUrl: string = `${BASE_URL}/user/v1/user?fields=trips`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.get(tripListUrl, {headers: header})
    .pipe(
      map(data => data),
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
      );
  }

  updateTrip(trip_id, start_date, end_date, status): Observable<any> {
    const updateTripUrl = `${BASE_URL}/trip/v1/trip/${trip_id}`;
    let trip = {
      start_date,
      end_date,
      status
    };
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.put(updateTripUrl, trip, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  refreshInviteLink(trip_id: number): Observable<any>  {
    const tripRefreshUrl: string = `${BASE_URL}/trip/v1/trip/${trip_id}`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.patch(tripRefreshUrl, null,  {headers: header, observe: 'response'})
      .pipe(
        catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
      );
  }

  joinToTrip(trip_uuid): Observable<any> {
    const tripInviteUrl: string = `${BASE_URL}/otc/v1/otc/${trip_uuid}`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.patch(tripInviteUrl, null, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }
}
