import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripUserListComponent } from './trip-user-list.component';

describe('TripUserListComponent', () => {
  let component: TripUserListComponent;
  let fixture: ComponentFixture<TripUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
