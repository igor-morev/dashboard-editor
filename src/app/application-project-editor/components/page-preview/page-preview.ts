import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataAccess } from '@app/application-project-editor/services/data-access';
import { ApplicationEditorState } from '@app/application-project-editor/state/application-editor-state';

@Component({
  selector: 'de-page-preview',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './page-preview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagePreview {
  private dataAccess = inject(DataAccess);
  private state = inject(ApplicationEditorState);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private objectUrl: string | null = null;

  previewUrl = signal<SafeResourceUrl | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    // This route sits outside ApplicationProjectEditor's children (deliberately — see
    // application-project-editor.routes.ts), so on a hard refresh nothing has populated
    // ApplicationEditorState yet. Load project+page from the route params ourselves whenever
    // in-memory state doesn't already match what the URL asks for.
    const pageId = this.route.snapshot.paramMap.get('pageId');
    const projectId =
      this.route.snapshot.paramMap.get('projectId') ??
      this.route.parent?.snapshot.paramMap.get('projectId') ??
      null;

    const alreadyLoaded =
      !!projectId &&
      this.state.appState.projectId === projectId &&
      this.state.appState.selectedPage.id === pageId;

    const ready$ =
      !alreadyLoaded && projectId && pageId
        ? this.dataAccess.loadProjectAndPage(projectId, pageId)
        : of(void 0);

    ready$
      .pipe(
        switchMap(() => this.dataAccess.getPreviewHtml()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (html) => this.showPreview(html),
        error: () => {
          this.isLoading.set(false);
          this.error.set("Couldn't load the preview. Please try again.");
        },
      });

    this.destroyRef.onDestroy(() => this.revokeObjectUrl());
  }

  backToEditor(): void {
    const projectId = this.state.appState.projectId;
    const pageId = this.state.appState.selectedPage.id;

    if (projectId) {
      this.router.navigate(['/project', projectId, 'page', pageId]);
    }
  }

  private showPreview(html: string): void {
    this.revokeObjectUrl();

    this.objectUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl));
    this.isLoading.set(false);
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
