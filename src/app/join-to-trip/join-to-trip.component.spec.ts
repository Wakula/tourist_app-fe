import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinToTripComponent } from './join-to-trip.component';

describe('JoinToTripComponent', () => {
  let component: JoinToTripComponent;
  let fixture: ComponentFixture<JoinToTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinToTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinToTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
