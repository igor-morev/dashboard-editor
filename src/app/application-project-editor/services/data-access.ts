import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { ProjectEditorApi } from '@app/api/services/project-editor-api';
import { ApplicationEditorState } from '../state/application-editor-state';
import { Widget } from '../types/widget.type';
import { scaffoldLayer } from '../utils/editor';
import { LayersEditor } from './layers-editor';
import { ThemeManager } from './theme-manager';
import { CreateProjectDto, ProjectDto, ProjectResponseDto } from '@app/api/types/project';
import { sectionWidget } from '../widgets-lib/section';
import {
  headerWidget,
  featureSectionWidget,
  heroWidget,
  bannerWidget,
  testimonialsWidget,
  faqWidget,
  footerWidget,
} from '../widgets-lib/sections';
import { contactSectionWidget } from '../widgets-lib/sections/contact';
import { Template } from '../types/template.type';

@Injectable({
  providedIn: 'root',
})
export class DataAccess {
  private api = inject(ProjectEditorApi);
  private state = inject(ApplicationEditorState);
  private layersEditor = inject(LayersEditor);
  private themeManager = inject(ThemeManager);

  get appState() {
    return this.state.appState;
  }

  createTemplate(response: ProjectResponseDto, source: Template['source']): Template {
    const widgets = this.convertResponseDtoToSectionWidgets(response);

    const templateId = `${source}-${response.industry}_${Date.now()}`;

    return {
      id: templateId,
      source,
      templateName: templateId,
      theme: response.theme,
      widgets,
    };
  }

  createProject(dto: CreateProjectDto): Observable<ProjectDto> {
    return this.api.createProject(dto).pipe(tap((project) => this.loadProjectData(project)));
  }

  loadProject(projectId: string): Observable<void> {
    return this.api.getProject(projectId).pipe(
      tap((project) => this.loadProjectData(project)),
      switchMap((project) =>
        project.pages[0] ? this.loadPage(project.pages[0].id) : of(void 0),
      ),
    );
  }

  /** Like loadProject(), but loads a specific page instead of always the first one — for
   * routes (e.g. the preview route) that need a given project+page loaded from a cold start,
   * such as after a hard refresh where no in-memory state exists yet. */
  loadProjectAndPage(projectId: string, pageId: string): Observable<void> {
    return this.api.getProject(projectId).pipe(
      tap((project) => this.loadProjectData(project)),
      switchMap(() => this.loadPage(pageId)),
    );
  }

  loadPage(pageId: string): Observable<void> {
    const projectId = this.appState.projectId;
    if (!projectId) {
      return of(void 0);
    }

    const page = this.appState.pages.find((p) => p.id === pageId);
    if (!page) {
      return of(void 0);
    }

    return this.api.loadPage(projectId, pageId).pipe(
      tap((pageDto) => {
        this.state.loadFromServer({
          projectId,
          pages: this.appState.pages,
          selectedPage: page,
          layers: this.layersEditor.toLayer(pageDto.layers, 'scaffold'),
        });
      }),
      map(() => void 0),
    );
  }

  save(): Observable<void> {
    const projectId = this.appState.projectId;
    const pageId = this.appState.selectedPage.id;

    if (!projectId) {
      return of(void 0);
    }

    // appViewSchema.layers is always [scaffoldLayer(content)] — a single synthetic root
    // wrapping the real content in its `children`. Serialize the unwrapped content, not the
    // scaffold wrapper itself, or loadFromServer()/toLayer() re-wraps it on the next load and
    // the tree grows an extra "scaffold" nesting level each save/load cycle.
    const content = this.appState.appViewSchema.layers[0]?.children ?? [];
    const layers = this.layersEditor.toLayerDto(content);
    const theme = this.themeManager.currentTheme();

    return forkJoin([
      this.api.savePage(projectId, pageId, layers),
      this.api.saveProject(projectId, { theme }),
    ]).pipe(
      tap(() => this.state.markSaved()),
      map(() => void 0),
    );
  }

  getPreviewHtml(): Observable<string> {
    // Same scaffold-unwrap as save() — appViewSchema.layers is always [scaffoldLayer(content)].
    const content = this.appState.appViewSchema.layers[0]?.children ?? [];

    return this.api.previewProject({
      projectName: this.appState.selectedPage.pageName,
      theme: this.themeManager.currentTheme(),
      layers: this.layersEditor.toLayerDto(content),
    });
  }

  createPage(pageName: string): Observable<void> {
    const projectId = this.appState.projectId;
    if (!projectId) {
      return of(void 0);
    }

    return this.api.createPage(projectId, { pageName }).pipe(
      tap((page) => {
        const pages = [...this.appState.pages, { id: page.id, pageName: page.pageName }];
        this.state.loadFromServer({
          projectId,
          pages,
          selectedPage: { id: page.id, pageName: page.pageName },
          layers: [],
        });
      }),
      map(() => void 0),
    );
  }

  deletePage(pageId: string): Observable<void> {
    const projectId = this.appState.projectId;
    if (!projectId) {
      return of(void 0);
    }

    return this.api.deletePage(projectId, pageId).pipe(
      switchMap(() => {
        const remainingPages = this.appState.pages.filter((p) => p.id !== pageId);
        const wasSelected = this.appState.selectedPage.id === pageId;

        if (wasSelected && remainingPages[0]) {
          const nextPage = remainingPages[0];
          // Update the pages list first so loadPage() (which looks the target page up in
          // appState.pages) can find it, then load its real content.
          this.state.loadFromServer({
            projectId,
            pages: remainingPages,
            selectedPage: nextPage,
            layers: [],
          });
          return this.loadPage(nextPage.id);
        }

        // Deleted a page that wasn't selected — just drop it from the list, keep the canvas as-is.
        this.state.loadFromServer({
          projectId,
          pages: remainingPages,
          selectedPage: this.appState.selectedPage,
          layers: this.appState.appViewSchema.layers[0]?.children ?? [],
        });
        return of(void 0);
      }),
    );
  }

  /**
   * Freezes the current draft into the published snapshot and makes it publicly reachable.
   * Saves first — publish() on the backend only copies whatever's already persisted, so this
   * guarantees the snapshot reflects the latest edits (and that theme/layers actually exist:
   * a project published before its first save would otherwise have an empty snapshot).
   */
  publish(): Observable<void> {
    const projectId = this.appState.projectId;
    if (!projectId) {
      return of(void 0);
    }

    return this.save().pipe(
      switchMap(() => this.api.publishProject(projectId)),
      tap((project) => this.state.setPublishStatus(project.status, project.publishedAt ?? null)),
      map(() => void 0),
    );
  }

  unpublish(): Observable<void> {
    const projectId = this.appState.projectId;
    if (!projectId) {
      return of(void 0);
    }

    return this.api.unpublishProject(projectId).pipe(
      tap((project) => this.state.setPublishStatus(project.status, project.publishedAt ?? null)),
      map(() => void 0),
    );
  }

  private loadProjectData(project: ProjectDto) {
    this.themeManager.setTheme(project.theme ?? {});
    this.state.setPublishStatus(project.status, project.publishedAt ?? null);

    const selectedPage = project.pages[0];

    this.state.loadFromServer({
      projectId: project.id,
      pages: project.pages,
      selectedPage,
      layers: [],
    });
  }

  renderByTemplate(template: Template) {
    console.log(template);
    // 1. Apply theme to the app state
    this.themeManager.setTheme(template.theme);

    // 2. Populate layers based on template widgets
    const layers = template.widgets.map((widget) => {
      return this.layersEditor.createLayerForWidget(widget, scaffoldLayer().id, 0);
    });

    this.state.setLayersState(layers);
  }

  convertResponseDtoToSectionWidgets(projectResponseDto: ProjectResponseDto) {
    // it should return array of widgets with all properties mapped from projectResponseDto
    return projectResponseDto.sections.map((section) => {
      switch (section.type) {
        case 'header': {
          console.log('Converting header section:', section);
          return headerWidget(section.layout as any, section.content as any);
        }

        case 'features': {
          return featureSectionWidget(section.layout as any, section.content as any);
        }

        case 'hero': {
          return heroWidget(section.layout as any, section.content as any);
        }

        case 'banner': {
          return bannerWidget(section.layout as any, section.content as any);
        }

        case 'testimonials': {
          return testimonialsWidget(section.layout as any, section.content as any);
        }

        case 'contact': {
          return contactSectionWidget(section.layout as any, section.content as any);
        }

        case 'faq': {
          return faqWidget(section.layout as any, section.content as any);
        }

        case 'footer': {
          return footerWidget(section.layout as any, section.content as any);
        }

        default:
          return sectionWidget();
      }
    });
  }
}
