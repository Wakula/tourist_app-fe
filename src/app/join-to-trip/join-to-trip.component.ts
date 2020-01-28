import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'

import {TripService} from '../_services/trip.service'


@Component({
  selector: 'app-join-to-trip',
  templateUrl: './join-to-trip.component.html',
  styleUrls: ['./join-to-trip.component.css']
})
export class JoinToTripComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private tripService: TripService,
    public router: Router,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      tripService.joinToTrip(params.trip_uuid).subscribe(res => {
        console.log(res)
        this.router.navigate(['trip-list'])
      })
    })
  }

  ngOnInit() { }

}
