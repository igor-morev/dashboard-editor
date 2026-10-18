import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectEditorApi } from '@app/api/services/project-editor-api';
import { ProjectSummaryDto } from '@app/api/types/project';

@Component({
  selector: 'de-application-projects',
  imports: [FormsModule, DatePipe],
  templateUrl: './application-projects.html',
  styleUrl: './application-projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationProjects implements OnInit {
  private api = inject(ProjectEditorApi);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  projects = signal<ProjectSummaryDto[]>([]);
  isLoading = signal(true);
  isCreating = signal(false);
  newProjectName = signal('');

  ngOnInit() {
    this.api
      .getProjectList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (projects) => {
          this.projects.set(projects);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  openProject(project: ProjectSummaryDto) {
    this.router.navigate(['/project', project.id]);
  }

  startCreating() {
    this.newProjectName.set('');
    this.isCreating.set(true);
  }

  cancelCreating() {
    this.isCreating.set(false);
  }

  confirmCreate() {
    const name = this.newProjectName().trim();
    if (!name) {
      return;
    }

    this.api
      .createProject({ name })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((project) => {
        this.router.navigate(['/project', project.id]);
      });
  }
}
