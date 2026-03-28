import { TestBed } from '@angular/core/testing';

import { LayerReordering } from './layer-reordering';

describe('LayerReordering', () => {
  let service: LayerReordering;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayerReordering);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
