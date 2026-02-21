import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaffoldOutlet } from './scaffold-outlet';

describe('ScaffoldOutlet', () => {
  let component: ScaffoldOutlet;
  let fixture: ComponentFixture<ScaffoldOutlet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaffoldOutlet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScaffoldOutlet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
