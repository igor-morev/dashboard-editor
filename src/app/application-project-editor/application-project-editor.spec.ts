import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationProjectEditor } from './application-project-editor';

describe('ApplicationProjectEditor', () => {
  let component: ApplicationProjectEditor;
  let fixture: ComponentFixture<ApplicationProjectEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationProjectEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationProjectEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
