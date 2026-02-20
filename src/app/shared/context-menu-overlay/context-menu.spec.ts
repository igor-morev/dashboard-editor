import { TestBed } from '@angular/core/testing';
import { ContextMenuOverlay } from './context-menu';


describe('ContextMenuOverlay', () => {
  let service: ContextMenuOverlay;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextMenuOverlay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
