import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject,  } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ErrorService } from './error.service';
import { BASE_URL } from './config';
import { Item, Role } from '../trip';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private personalInventorySource = new BehaviorSubject(0)
  personalInventoryStatus = this.personalInventorySource.asObservable()
  public selectedItemSource = new BehaviorSubject(null);
  public userItemsSource = new BehaviorSubject(null);
  selectedItem = this.selectedItemSource.asObservable();
  userItems = this.userItemsSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorService: ErrorService,
  ) { }

  selectNewItem(item: Item) {
    this.selectedItemSource.next(item);
  }
  addUserItems(items) {
    this.userItemsSource.next(items)
  }

  getTripItems(trip_id: number): Observable<any> {
    if (!this.personalInventorySource.getValue()) {
      const url = BASE_URL + `/trip/v1/trip/${trip_id}?fields=equipment`;
      let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
      return this.http.get(url, {headers: header})
      .pipe(
        catchError((err) => this.errorService.handleError(err, this.authService.getSessionId())))
      } else {
        const userId = this.personalInventorySource.getValue()
        const url = BASE_URL + `/user/v1/user?fields=personal_stuff,equipment&trip_id=${trip_id}&user_id=${userId}`;
        let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
        return this.http.get(url, {headers: header})
        .pipe(
          catchError((err) => this.errorService.handleError(err, this.authService.getSessionId())))
      }
    }

  addTripItem(itemData: Item): Observable<any> {
    const url = BASE_URL + `/equipment/v1/equipment`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.post(url, itemData, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  deleteTripItem(equipment_id: number): Observable<any> {
    const url = BASE_URL + `/equipment/v1/equipment/${equipment_id}`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.delete(url, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  togglePersonalInventory(userId) {
    if (userId === this.personalInventorySource.getValue()) {
      this.personalInventorySource.next(0)
    } else {
      this.personalInventorySource.next(userId)
    }
  }

  changeTripItem(equipment_id: number, itemData: Item): Observable<any> {
    const url = BASE_URL + `/equipment/v1/equipment/${equipment_id}`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.put(url, itemData, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }

  dispenseItems(dispensedItems, item_id): Observable<any> {
    const url = `${BASE_URL}/equipment/v1/equipment/${item_id}`;
    let header = new HttpHeaders({'Authorization': this.authService.getSessionId()});
    return this.http.patch(url, dispensedItems, {headers: header})
    .pipe(
      catchError((err) => this.errorService.handleError(err, this.authService.getSessionId()))
    );
  }
}
