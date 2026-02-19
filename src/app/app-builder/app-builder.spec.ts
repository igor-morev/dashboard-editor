import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBuilder } from './app-builder';

describe('AppBuilder', () => {
  let component: AppBuilder;
  let fixture: ComponentFixture<AppBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
