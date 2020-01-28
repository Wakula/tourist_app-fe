import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripItemListComponent } from './trip-item-list.component';

describe('TripItemListComponent', () => {
  let component: TripItemListComponent;
  let fixture: ComponentFixture<TripItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
