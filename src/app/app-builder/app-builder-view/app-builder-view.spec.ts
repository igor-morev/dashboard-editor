import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBuilderView } from './app-builder-view';

describe('AppBuilderView', () => {
  let component: AppBuilderView;
  let fixture: ComponentFixture<AppBuilderView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBuilderView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppBuilderView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
