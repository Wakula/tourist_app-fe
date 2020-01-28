import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRolesComponent } from './trip-roles.component';

describe('TripRolesComponent', () => {
  let component: TripRolesComponent;
  let fixture: ComponentFixture<TripRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
