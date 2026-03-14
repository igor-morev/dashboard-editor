import { TestBed } from '@angular/core/testing';

import { WidgetsState } from './widgets-state';

describe('WidgetsState', () => {
  let service: WidgetsState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetsState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
