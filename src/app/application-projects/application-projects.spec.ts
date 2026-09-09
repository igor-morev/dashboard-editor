import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationProjects } from './application-projects';

describe('ApplicationProjects', () => {
  let component: ApplicationProjects;
  let fixture: ComponentFixture<ApplicationProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationProjects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
