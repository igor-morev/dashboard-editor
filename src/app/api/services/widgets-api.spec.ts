import { TestBed } from '@angular/core/testing';

import { WidgetsApi } from './widgets-api';

describe('WidgetsApi', () => {
  let service: WidgetsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
