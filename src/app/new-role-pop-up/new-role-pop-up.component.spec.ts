import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRolePopUpComponent } from './new-role-pop-up.component';

describe('NewRolePopUpComponent', () => {
  let component: NewRolePopUpComponent;
  let fixture: ComponentFixture<NewRolePopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRolePopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRolePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
