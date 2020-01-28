import { Component, OnInit } from '@angular/core';
import { Trip } from '../trip';
import { FormControl, Validators } from "@angular/forms";
import { TripService } from "../_services/trip.service";

@Component({
  selector: 'app-create-trip-page',
  templateUrl: './create-trip-page.component.html',
  styleUrls: ['./create-trip-page.component.css']
})
export class CreateTripPageComponent implements OnInit {
  TripName = new FormControl('',[Validators.required,
    Validators.minLength(3), Validators.maxLength(30)]);
  TripDescription = new FormControl();
  StartDate = new FormControl((new Date()));
  EndDate = new FormControl((new Date()));

  button_disabled = true;
  today = new Date();

  trip: Trip = {
    name: '',
    description: '',
    start_date: ''
  };
  constructor(
    private tripService : TripService,
    )  { }

  create_trip()
  {
    // ---- fixing timezone in mat-datepicker
    this.StartDate.value.setMinutes((this.StartDate.value.getMinutes() - this.StartDate.value.getTimezoneOffset()));
    this.EndDate.value.setMinutes((this.EndDate.value.getMinutes() - this.EndDate.value.getTimezoneOffset()));
    // ---- fixing timezone in mat-datepicker
    let tripDescription = this.TripDescription.value? this.TripDescription.value : '';// ---fix of null description
    this.tripService.createTrip(this.TripName.value, this.StartDate.value,
        this.EndDate.value, tripDescription);
  } 
  ngOnInit() { }

   public refreshButtonState():  void {
    let isDateInCorrect = this.EndDate.value < this.StartDate.value;
    let isNameInCorrect = this.TripName.hasError('minlength')||
        this.TripName.hasError('maxlength')||
        this.TripName.hasError('required');
    this.button_disabled = isDateInCorrect || isNameInCorrect;
  }
}
