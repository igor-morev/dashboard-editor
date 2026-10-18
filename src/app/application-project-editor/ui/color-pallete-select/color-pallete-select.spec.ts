import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPalleteSelect } from './color-pallete-select';

describe('ColorPalleteSelect', () => {
  let component: ColorPalleteSelect;
  let fixture: ComponentFixture<ColorPalleteSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPalleteSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPalleteSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
