import { TestBed } from '@angular/core/testing';

import { AppBuilderState } from './app-builder-state';

describe('AppBuilderState', () => {
  let service: AppBuilderState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppBuilderState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
