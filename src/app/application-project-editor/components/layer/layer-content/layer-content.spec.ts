import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerContent } from './layer-content';

describe('LayerContent', () => {
  let component: LayerContent;
  let fixture: ComponentFixture<LayerContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerContent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
