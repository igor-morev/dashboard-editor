import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectComparison } from './object-comparison';

describe('ObjectComparison', () => {
  let component: ObjectComparison;
  let fixture: ComponentFixture<ObjectComparison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectComparison]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectComparison);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
