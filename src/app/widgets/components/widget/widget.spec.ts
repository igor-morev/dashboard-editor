import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericWidget } from './widget';


describe('GenericWidget', () => {
  let component: GenericWidget;
  let fixture: ComponentFixture<GenericWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
