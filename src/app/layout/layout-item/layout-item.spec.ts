import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutItemComponent } from './layout-item';


describe('LayoutItem', () => {
  let component: LayoutItemComponent;
  let fixture: ComponentFixture<LayoutItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
