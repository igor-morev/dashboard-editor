import { TestBed } from '@angular/core/testing';

import { TailwindLayerPropertyConverter } from './layer-property-converter';

describe('LayerPropertyConverter', () => {
  let service: TailwindLayerPropertyConverter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TailwindLayerPropertyConverter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
