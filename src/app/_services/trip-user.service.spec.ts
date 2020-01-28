import { TestBed } from '@angular/core/testing';

import { TripUserService } from './trip-user.service';

describe('TripUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TripUserService = TestBed.get(TripUserService);
    expect(service).toBeTruthy();
  });
});
