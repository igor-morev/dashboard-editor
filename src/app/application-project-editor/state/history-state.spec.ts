import { TestBed } from '@angular/core/testing';
import { HistoryEditorState } from './history-state';

describe('HistoryEditorState', () => {
  let service: HistoryEditorState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryEditorState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
