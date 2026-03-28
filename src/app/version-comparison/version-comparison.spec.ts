import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionComparison } from './version-comparison';

describe('VersionComparison', () => {
  let component: VersionComparison;
  let fixture: ComponentFixture<VersionComparison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionComparison]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionComparison);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
