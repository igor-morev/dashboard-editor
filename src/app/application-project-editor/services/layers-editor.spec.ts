import { TestBed } from '@angular/core/testing';

import { LayersEditor } from './layers-editor';

describe('LayersEditor', () => {
  let service: LayersEditor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayersEditor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
