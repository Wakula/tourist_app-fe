import {Component, Input, OnInit} from '@angular/core';
import {TripService} from "../_services/trip.service";
import {Trip} from "../trip";

interface Marker {
  order: number;
  lat: number;
  lng: number;
  name: string;
  selected: boolean;
}

interface Location {
  lat: number;
  lng: number;
  zoom: number;
  markers?: Marker[];
}
@Component({
  selector: 'app-trip-detail-page-map',
  templateUrl: './trip-detail-page-map.component.html',
  styleUrls: ['./trip-detail-page-map.component.css']
})
export class TripDetailPageMapComponent implements OnInit {
  @Input() trip: Trip;

  public location: Location = {
    lat: 50.431273,
    lng: 30.550139,
    markers: [ ],
    zoom: 5
  };

  createCheckpointsList(): void {
    if (this.trip.points) {
      for(var counter:number = 0; counter<this.trip.points.length; counter++){
        let marker = this.trip.points[counter];
        const newMarker: Marker = {
          order: counter +1,
          name: marker.name,
          lat: marker.latitude,
          lng:  marker.longitude,
          selected: false,};
        this.location.markers.push(newMarker);
      }
    this.tripService.updateCheckpointList(this.location.markers);

    this.location.lat = this.trip.points[0].latitude;
    this.location.lng = this.trip.points[0].longitude;
    }
  }

  constructor(private tripService : TripService) { }
  ngOnInit() {
    this.createCheckpointsList();
  }

}
