import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorContextMenu } from './context-menu';

describe('ContextMenu', () => {
  let component: EditorContextMenu;
  let fixture: ComponentFixture<EditorContextMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorContextMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorContextMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
