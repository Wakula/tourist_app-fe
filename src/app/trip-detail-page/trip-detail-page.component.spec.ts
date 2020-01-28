import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailPageComponent } from './trip-detail-page.component';

describe('TripDetailPageComponent', () => {
  let component: TripDetailPageComponent;
  let fixture: ComponentFixture<TripDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
