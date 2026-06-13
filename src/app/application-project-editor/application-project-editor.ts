import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  DOCUMENT,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextMenuOverlay } from '@app/shared/context-menu-overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EditorContextMenu } from './ui/context-menu/context-menu';
import { ApplicationEditorState } from './state/application-editor-state';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LayerPropertyBuilder } from './components/layer-property-builder/layer-property-builder';
import { WidgetsState } from './state/widgets-state';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Autofocus } from './ui/directives/autofocus';
import { LayersEditor } from './services/layers-editor';
import { CdkDrag, CdkDragDrop, CdkDragMove, CdkDropList } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { ThemeManager } from './services/theme-manager';
import { Layer, EditorCommand } from './types/project.type';
import { Widget } from './types/widget.type';
import { Template } from './types/template.type';
import { ProjectEditorApi } from '@app/api/services/project-editor-api';
import { DataAccess } from './services/data-access';
import { AI_CONSTRUCTION_RESPONSE } from './mock/ai-construction';
import { LayerDto, ProjectResponseDto } from '@app/api/types/project';
import { PROJECT_PAGE_RESPONSE } from './mock/response';
import { AI_FINTECH_RESPONSE } from './mock/ai-fintech';
import { FilterPipe } from '@app/shared/filter-pipe';
import { AI_GAMING_RESPONSE } from './mock/ai-gaming';
import { AI_CLINIC_PAGE } from './mock/ai-clinic';

interface WidgetsTab {
  label: string;
  value: 'widgets' | 'predefined' | 'ai-generated';
}

@Component({
  selector: 'de-application-project-editor',
  imports: [
    NgTemplateOutlet,
    FormsModule,
    NgClass,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LayerPropertyBuilder,
    MatButtonModule,
    MatIconModule,
    Autofocus,
    CdkDropList,
    CdkDrag,
    FilterPipe,
  ],
  templateUrl: './application-project-editor.html',
  styleUrl: './application-project-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationProjectEditor {
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private contextMenuOverlay = inject(ContextMenuOverlay);
  private readonly api = inject(ProjectEditorApi);
  private readonly state = inject(ApplicationEditorState);
  private readonly widgetsState = inject(WidgetsState);
  private readonly themeManager = inject(ThemeManager);
  private readonly dataAccess = inject(DataAccess);

  private layersEditor = inject(LayersEditor);

  private expandedLayers = signal<Set<string>>(new Set());

  editingLayerId = signal<string | null>(null);

  highlightedLayer = this.state.highlightedLayer;

  dragMovedEvent = new Subject<CdkDragMove<Layer>>();
  dragDroppedEvent = new Subject<CdkDragDrop<Layer[]>>();

  widgetTabs: WidgetsTab[] = [
    {
      label: 'Widgets',
      value: 'widgets',
    },
    {
      label: 'Templates',
      value: 'predefined',
    },
    {
      label: 'AI',
      value: 'ai-generated',
    },
  ];

  tab = signal<WidgetsTab>({
    label: 'Widgets',
    value: 'widgets',
  });

  private _dragPosition = signal<{ position: 'before' | 'after' | 'inside'; id: string } | null>(
    null,
  );
  dragPosition = this._dragPosition.asReadonly();

  constructor() {
    this.dragMovedEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      this.handleDragMove(event);
    });

    this.dragDroppedEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      this.handleDragDrop(event);
    });
  }

  ngOnInit() {
    // this.api.loadPage('1', '1').subscribe((response) => {
    //   const template = this.dataAccess.createTemplate(response);

    //   // temporal solution for demo, we'll remove it later on
    //   this.widgetsState.addTemplate(template);

    //   this.dataAccess.renderByTemplate(template);
    // });

    (
      [
        AI_CONSTRUCTION_RESPONSE,
        AI_FINTECH_RESPONSE,
        PROJECT_PAGE_RESPONSE,
        AI_GAMING_RESPONSE,
        AI_CLINIC_PAGE,
      ] as ProjectResponseDto[]
    ).forEach((response, index) => {
      const template = this.dataAccess.createTemplate(response, 'ai-generated');

      this.widgetsState.addTemplate(template);
    });
  }

  get appState() {
    return this.state.appState;
  }

  get selectedLayer() {
    return this.state.appState.selectedLayer;
  }

  get layers() {
    return this.state.appState.appViewSchema.layers;
  }

  get widgets() {
    return this.widgetsState.widgets;
  }

  get templates() {
    return this.widgetsState.templates;
  }

  get pages() {
    return this.state.pages;
  }

  changeTheme(event: Event) {
    this.themeManager.setThemeByPreset(
      event.target instanceof HTMLSelectElement ? event.target.value : '',
    );
  }

  getParent(parentId: string, reccursive = false): Layer | null {
    const parent = this.appState.appViewSchema.layersMap[parentId];

    if (!parent) {
      return null;
    }

    if (reccursive && parent.parentId) {
      return this.getParent(parent.parentId, true);
    }

    return parent;
  }

  handleDragMove(event: CdkDragMove<Layer>) {
    const elementByPositionRef = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y,
    );

    if (!elementByPositionRef) {
      this.clearDragInfo();
      return;
    }

    const nodeContainer = elementByPositionRef.classList.contains('[data-layer-id]')
      ? elementByPositionRef
      : elementByPositionRef.closest('[data-layer-id]');

    if (!nodeContainer) {
      this.clearDragInfo();
      return;
    }

    const layerId = nodeContainer.getAttribute('data-layer-id')!;

    const targetRect = nodeContainer.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      this.setDragPosition({
        position: 'before',
        id: layerId,
      });
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      this.setDragPosition({
        position: 'after',
        id: layerId,
      });
    } else {
      this.setDragPosition({
        position: 'inside',
        id: layerId,
      });
    }
  }

  handleDragDrop(event: CdkDragDrop<Layer[]>) {
    const dragPosition = this.dragPosition();

    if (!dragPosition) {
      return;
    }

    const dragPositionLayer = this.appState.appViewSchema.layersMap[dragPosition.id];

    const targetIndex = this.calculateTargetIndex(
      dragPositionLayer,
      dragPosition.position,
      event.item.data,
    );

    if (event.item.data.id === dragPositionLayer.id) {
      this.clearDragInfo();
      return;
    }

    if (
      (dragPosition.position === 'before' || dragPosition.position === 'after') &&
      event.container.data.length === 1
    ) {
      this.clearDragInfo();
      return;
    }

    if (
      (dragPosition.position === 'before' || dragPosition.position === 'after') &&
      event.previousIndex === targetIndex &&
      event.item.data.parentId === dragPositionLayer.parentId
    ) {
      this.clearDragInfo();
      return;
    }

    if (
      ((dragPosition.position === 'before' && event.previousIndex < targetIndex) ||
        (dragPosition.position === 'after' && event.previousIndex > targetIndex)) &&
      event.item.data.parentId === dragPositionLayer.parentId
    ) {
      this.clearDragInfo();
      return;
    }

    if (
      dragPosition.position === 'inside' &&
      dragPositionLayer.widgetReference.canNotBeAddedInside?.(event.item.data.widgetReference)
    ) {
      this.clearDragInfo();
      return;
    }

    const updatedLayers =
      dragPosition.position === 'inside'
        ? this.layersEditor.moveLayerInSchema(
            this.appState.appViewSchema.layers,
            event.item.data,
            dragPositionLayer.id,
          )
        : this.layersEditor.moveLayerInSchema(
            this.appState.appViewSchema.layers,
            event.item.data,
            dragPositionLayer.parentId!,
            targetIndex,
          );
    const updatedLayersTree = this.layersEditor.recalculateLayersIndex(updatedLayers);

    const updatedMap = this.layersEditor.updateLayersMap(updatedLayersTree, {});

    this.state.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayersTree,
        layersMap: updatedMap,
      },
      selectedLayer: updatedMap[this.selectedLayer?.id || ''],
    });

    if (dragPosition.position === 'inside') {
      this.expandLayer(dragPositionLayer.id);
    }

    this.clearDragInfo();
  }

  calculateTargetIndex(
    targetLayer: Layer,
    position: 'before' | 'after' | 'inside',
    movingLayer: Layer,
  ): number {
    if (position === 'inside') {
      return targetLayer.children.length;
    }

    if (targetLayer.parentId === movingLayer.parentId) {
      return targetLayer.index;
    }

    return position === 'before' ? targetLayer.index : targetLayer.index + 1;
  }

  isLayerExpanded(layerId: string): boolean {
    return this.expandedLayers().has(layerId);
  }

  toggleLayerExpanded(layerId: string, event: Event) {
    // event.stopPropagation();
    const expanded = new Set(this.expandedLayers());

    if (expanded.has(layerId)) {
      expanded.delete(layerId);
    } else {
      expanded.add(layerId);
    }

    this.expandedLayers.set(expanded);
    this.cdr.markForCheck();
  }

  canUndo() {
    return this.state.canUndo();
  }

  canRedo() {
    return this.state.canRedo();
  }

  moveWidgetOnScaffold(event: Event, widget: Widget) {
    event.preventDefault();
    this.createLayer(widget);
  }

  renderTemplateOnScaffold(event: Event, template: Template) {
    this.state.resetAppState();

    this.dataAccess.renderByTemplate(template);

    this.router.navigate(['/project', '1', 'page', 'page-1']);
  }

  highlightLayerFromTree(event: Event, layer: Layer) {
    this.highlightLayer(layer);
  }

  unhighlightLayerFromTree(event: Event) {
    this.unhighlightLayer();
  }

  clickOnLayerFromScaffold(event: MouseEvent) {
    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (id) {
      this.selectLayer(this.appState.appViewSchema.layersMap[id]);
      if (this.selectedLayer.parentId) {
        this.expandByLayer(this.selectedLayer);
      }
    }
  }

  expandLayer(layerId: string) {
    this.expandedLayers.update((expanded) => new Set(expanded).add(layerId));
  }

  expandByLayer(layer: Layer) {
    if (layer.parentId) {
      this.expandLayer(layer.parentId);
      const parentLayer = this.appState.appViewSchema.layersMap[layer.parentId];
      if (parentLayer) {
        this.expandByLayer(parentLayer);
      }
    }
  }

  clickOnLayerFromTree(event: MouseEvent) {
    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (id) {
      this.selectLayer(this.appState.appViewSchema.layersMap[id]);
    }
  }

  mouseMoveOnScaffold(event: Event) {
    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (id) {
      this.highlightLayer(this.appState.appViewSchema.layersMap[id]);
    } else {
      this.unhighlightLayer();
    }
  }

  contextMenuOnLayer(event: MouseEvent) {
    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (!id) {
      return;
    }

    this.selectLayer(this.appState.appViewSchema.layersMap[id]);

    if (!this.selectedLayer.parentId) {
      return;
    }

    const overlayRef = this.contextMenuOverlay.open<EditorContextMenu, EditorCommand>(
      event,
      EditorContextMenu,
      this.selectedLayer,
    );

    overlayRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result === 'delete') {
          this.removeLayer();
        }

        if (result === 'duplicate') {
          this.duplicateLayer();
        }

        this.cdr.markForCheck();
      });
  }

  mouseMoveOnTree(event: Event) {
    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (id) {
      this.highlightLayer(this.appState.appViewSchema.layersMap[id]);
    } else {
      this.unhighlightLayer();
    }
  }

  mouseLeaveOnTree() {
    this.unhighlightLayer();
  }

  selectPage(page: { id: string; pageName: string }) {
    if (page) {
      this.state.updateAppState({
        selectedPage: page,
      });
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const modifier = isMac ? event.metaKey : event.ctrlKey;

    if (modifier && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.undo();
    } else if (
      (modifier && event.shiftKey && event.key === 'z') ||
      (modifier && event.key === 'y')
    ) {
      event.preventDefault();
      this.redo();
    }
  }

  undo() {
    console.log('Undo');
    this.state.undo();
  }

  redo() {
    console.log('Redo');
    this.state.redo();
  }

  toggleLayerVisibility($event: Event, selectedLayer: Layer) {
    const updatedLayer = {
      ...selectedLayer,
      isVisible: !selectedLayer.isVisible,
    };

    const updatedLayersTree = this.layersEditor.updateLayerInTree(
      this.appState.appViewSchema.layers,
      selectedLayer.id,
      updatedLayer,
    );

    this.state.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayersTree,
        layersMap: this.layersEditor.updateLayersMap(updatedLayersTree, {}),
      },
    });
  }

  toggleLayerLock($event: Event, selectedLayer: Layer) {
    const updatedLayer = {
      ...selectedLayer,
      locked: !selectedLayer.locked,
    };

    const updatedLayersTree = this.layersEditor.updateLayerInTree(
      this.appState.appViewSchema.layers,
      selectedLayer.id,
      updatedLayer,
    );

    const updatedLayersMap = this.layersEditor.updateLayersMap(updatedLayersTree, {});

    this.state.updateAppState({
      selectedLayer: updatedLayersMap[selectedLayer.id],
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayersTree,
        layersMap: updatedLayersMap,
      },
    });
  }

  startEditingLayer(layer: Layer): void {
    if (layer.locked) {
      return;
    }
    this.editingLayerId.set(layer.id);
  }

  saveLayerName(layer: Layer, newName: string): void {
    if (newName.trim()) {
      this.state.updateLayerName(layer, newName);
    }
    this.editingLayerId.set(null);
  }

  cancelEditingLayer(): void {
    this.editingLayerId.set(null);
  }

  dragMoved(event: CdkDragMove<Layer>) {
    this.dragMovedEvent.next(event);
  }

  clearDragInfo() {
    this._dragPosition.set(null);
  }

  setDragPosition(position: { position: 'before' | 'after' | 'inside'; id: string } | null) {
    this._dragPosition.set(position);
  }

  /**
   * Handle CDK drag-drop from layer tree
   */
  onLayerDragDrop(event: CdkDragDrop<Layer[]>) {
    this.dragDroppedEvent.next(event);
  }

  selectTab(tab: WidgetsTab) {
    this.tab.set(tab);
  }

  exportProject() {
    this.api
      .exportByJson({
        projectName: this.appState.selectedPage.pageName,
        theme: this.themeManager.currentTheme(),
        layers: this.convertUiLayersToServerFormat(this.appState.appViewSchema.layers),
      })
      .subscribe((response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.appState.selectedPage.pageName.toLowerCase().split(' ').join('_')}.html`;
        a.click();
      });
  }

  convertUiLayersToServerFormat(layers: Layer[]): LayerDto[] {
    return layers.map((layer) => ({
      id: layer.id,
      isVisible: layer.isVisible,
      widgetReference: {
        widgetType: layer.widgetReference.widgetType,
      },
      layerPropertyModel: {
        defaultClass: layer.layerPropertyModel.defaultClass,
        class: layer.layerPropertyModel.class,
        content: layer.layerPropertyModel.content,

        label: 'label' in layer.layerPropertyModel ? layer.layerPropertyModel.label : undefined,
        placeholder:
          'placeholder' in layer.layerPropertyModel
            ? layer.layerPropertyModel.placeholder
            : undefined,
        name: 'name' in layer.layerPropertyModel ? layer.layerPropertyModel.name : undefined,
        required:
          'required' in layer.layerPropertyModel ? layer.layerPropertyModel.required : undefined,
        options:
          'options' in layer.layerPropertyModel ? layer.layerPropertyModel.options : undefined,
        type: 'type' in layer.layerPropertyModel ? layer.layerPropertyModel.type : undefined,
        inputType:
          'inputType' in layer.layerPropertyModel ? layer.layerPropertyModel.inputType : undefined,

        background: layer.layerPropertyModel.styles
          ?.background as LayerDto['layerPropertyModel']['background'],
        color: layer.layerPropertyModel.styles?.color as LayerDto['layerPropertyModel']['color'],

        href: 'href' in layer.layerPropertyModel ? layer.layerPropertyModel.href : undefined,
        target: 'target' in layer.layerPropertyModel ? layer.layerPropertyModel.target : undefined,
      },
      children: this.convertUiLayersToServerFormat(layer.children),
    }));
  }

  private createLayer(widget: Widget) {
    if (
      this.selectedLayer &&
      this.selectedLayer.widgetReference.canNotBeAddedInside &&
      this.selectedLayer.widgetReference.canNotBeAddedInside(widget)
    ) {
      return;
    }

    const newLayer = this.layersEditor.createLayerForWidget(
      widget,
      this.selectedLayer.id,
      this.selectedLayer.children.length,
    );
    const updatedLayers = this.layersEditor.insertLayerInSchema(
      this.appState.appViewSchema.layers,
      this.selectedLayer.id,
      newLayer,
    );
    const updatedMap = this.layersEditor.updateLayersMap(updatedLayers, {});

    this.state.updateAppState({
      selectedLayer: updatedMap[newLayer.parentId!],
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayers,
        layersMap: this.layersEditor.updateLayersMap(updatedLayers, {}),
      },
    });

    this.expandLayer(newLayer.parentId!);
  }

  private duplicateLayer() {
    if (!this.selectedLayer) {
      console.warn('No layer selected for deletion');
      return;
    }

    if (!this.selectedLayer.parentId) {
      return;
    }

    const newLayer = this.layersEditor.duplicateLayerTree(this.selectedLayer);

    const updatedLayers = this.layersEditor.recalculateLayersIndex(
      this.layersEditor.insertLayerInSchema(
        this.appState.appViewSchema.layers,
        this.selectedLayer.parentId,
        newLayer,
        this.selectedLayer.index + 1,
      ),
    );

    this.state.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayers,
        layersMap: this.layersEditor.updateLayersMap(updatedLayers, {}),
      },
    });
  }

  private removeLayer() {
    if (!this.selectedLayer) {
      console.warn('No layer selected for deletion');
      return;
    }

    if (!this.selectedLayer.parentId) {
      return;
    }

    const updatedLayers = this.layersEditor.recalculateLayersIndex(
      this.layersEditor.removeLayerInSchema(
        this.appState.appViewSchema.layers,
        this.selectedLayer.id,
      ),
    );

    this.state.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayers,
        layersMap: this.layersEditor.updateLayersMap(updatedLayers, {}),
      },
    });

    this.selectParentLayer();
  }

  private selectParentLayer() {
    if (this.appState.selectedLayer.parentId) {
      this.selectLayer(this.appState.appViewSchema.layersMap[this.appState.selectedLayer.parentId]);
    }
  }

  private selectLayer(layer: Layer) {
    if (this.selectedLayer && this.selectedLayer.id === layer.id) {
      return;
    }

    console.log('Selected layer:', layer);

    this.state.updateAppState({
      selectedLayer: layer,
    });
  }

  private highlightLayer(layer: Layer) {
    if (this.highlightedLayer()?.id === layer.id) {
      return;
    }

    this.state.highlightLayer(layer);
  }

  private unhighlightLayer() {
    if (this.highlightedLayer === undefined) {
      return;
    }

    this.state.highlightLayer(null);
  }
}
