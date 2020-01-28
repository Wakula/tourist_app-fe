import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailPageMapComponent } from './trip-detail-page-map.component';

describe('TripDetailPageMapComponent', () => {
  let component: TripDetailPageMapComponent;
  let fixture: ComponentFixture<TripDetailPageMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripDetailPageMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDetailPageMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
