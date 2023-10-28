import { TestBed } from '@angular/core/testing';

import { SessionGuard } from './session-guard.service';

describe('SessionGuardService', () => {
  let service: SessionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
