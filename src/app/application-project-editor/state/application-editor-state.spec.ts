import { TestBed } from '@angular/core/testing';

import { ApplicationEditorState } from './application-editor-state';

describe('ApplicationEditorState', () => {
  let service: ApplicationEditorState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationEditorState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
