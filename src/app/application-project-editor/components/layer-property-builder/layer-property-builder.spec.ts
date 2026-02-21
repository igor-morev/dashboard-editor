import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerPropertyBuilder } from './layer-property-builder';

describe('LayerPropertyBuilder', () => {
  let component: LayerPropertyBuilder;
  let fixture: ComponentFixture<LayerPropertyBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerPropertyBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerPropertyBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
