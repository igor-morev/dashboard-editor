import { inject, Injectable, signal } from '@angular/core';
import { scaffoldLayer } from '../utils/editor';
import { HistoryEditorState } from './history-state';
import { LayersEditor } from '../services/layers-editor';
import { AppState, Layer, Page } from '../types/project.type';

@Injectable({
  providedIn: 'root',
})
export class ApplicationEditorState {
  private layersEditor = inject(LayersEditor);
  private historyState = inject(HistoryEditorState);

  private _appState: AppState = {
    projectId: null,
    pages: [
      {
        id: 'page-1',
        pageName: 'Home Page',
      },
      {
        id: 'page-2',
        pageName: 'Contacts Page',
      },
    ],
    selectedPage: {
      id: 'page-1',
      pageName: 'Home Page',
    },
    selectedLayer: scaffoldLayer(),
    appViewSchema: {
      device: 'sm',
      layers: [scaffoldLayer()],
      layersMap: {
        scaffold: scaffoldLayer(),
      },
    },
  };

  get appState() {
    return this._appState;
  }

  layers = signal(this._appState.appViewSchema.layers);
  selectedlayer = signal(this._appState.selectedLayer);
  _highlightedLayer = signal<Layer | null>(null);
  highlightedLayer = this._highlightedLayer.asReadonly();

  private _hasUnsavedChanges = signal(false);
  hasUnsavedChanges = this._hasUnsavedChanges.asReadonly();

  private _lastSavedAt = signal<Date | null>(null);
  lastSavedAt = this._lastSavedAt.asReadonly();

  markSaved() {
    this._hasUnsavedChanges.set(false);
    this._lastSavedAt.set(new Date());
  }

  setProjectId(projectId: string) {
    this._appState.projectId = projectId;
  }

  get pages() {
    return this._appState.pages;
  }

  constructor() {
    this.historyState.pushState({
      appViewSchema: this._appState.appViewSchema,
      selectedLayer: this._appState.selectedLayer,
      timestamp: Date.now(),
    });
  }

  /**
   * Clears the current canvas (layers + selection) before applying a new template.
   * Preserves projectId/pages/selectedPage when a real project is loaded — falls back
   * to demo stub pages otherwise (no project loaded yet).
   */
  resetAppState() {
    const hasRealProject = !!this._appState.projectId;

    const initialState: AppState = {
      projectId: this._appState.projectId,
      pages: hasRealProject
        ? this._appState.pages
        : [
            { id: 'page-1', pageName: 'Home Landing Page' },
            { id: 'page-2', pageName: 'Contacts Page' },
          ],
      selectedPage: hasRealProject
        ? this._appState.selectedPage
        : { id: 'page-1', pageName: 'Home Landing Page' },
      selectedLayer: scaffoldLayer(),
      appViewSchema: {
        device: 'sm',
        layers: [scaffoldLayer()],
        layersMap: {
          scaffold: scaffoldLayer(),
        },
      },
    };

    // this.historyState.clearHistory();
    this.updateState(initialState);
  }

  setLayersState(layers: Layer[]) {
    const newLayers = [scaffoldLayer(layers)];

    this.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: newLayers,
        layersMap: this.layersEditor.updateLayersMap(newLayers, {}),
      },
    });
  }

  updateAppState(updates: Partial<AppState>) {
    const newState = { ...this.appState, ...updates };

    this.historyState.pushState({
      appViewSchema: newState.appViewSchema,
      selectedLayer: newState.selectedLayer,
      timestamp: Date.now(),
    });

    this.updateState(newState);
    this._hasUnsavedChanges.set(true);

    console.log('Updated App State:', this.appState);
  }

  /**
   * Replaces the current layers/pages with content freshly loaded from the server.
   * Unlike `updateAppState`, this does not mark the project as having unsaved changes —
   * it's mirroring what's already persisted, not a new edit.
   */
  loadFromServer(params: { projectId: string; pages: Page[]; selectedPage: Page; layers: Layer[] }) {
    const newLayers = [scaffoldLayer(params.layers)];

    const newState: AppState = {
      ...this.appState,
      projectId: params.projectId,
      pages: params.pages,
      selectedPage: params.selectedPage,
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: newLayers,
        layersMap: this.layersEditor.updateLayersMap(newLayers, {}),
      },
    };

    this.updateState(newState);
    this._hasUnsavedChanges.set(false);
  }

  highlightLayer(layer: Layer | null) {
    this._highlightedLayer.set(layer);
  }

  undo() {
    const previousState = this.historyState.undo();
    if (previousState) {
      this.updateState({
        ...this.appState,
        appViewSchema: previousState.appViewSchema,
        selectedLayer: previousState.selectedLayer,
      });
    }
  }

  redo() {
    const nextState = this.historyState.redo();
    if (nextState) {
      this.updateState({
        ...this.appState,
        appViewSchema: nextState.appViewSchema,
        selectedLayer: nextState.selectedLayer,
      });
    }
  }

  canUndo(): boolean {
    return this.historyState.canUndo();
  }

  canRedo(): boolean {
    return this.historyState.canRedo();
  }

  updateLayerName(layer: Layer, newName: string): void {
    const updatedLayer: Layer = {
      ...layer,
      layerName: newName,
    };

    const updatedLayersTree = this.layersEditor.updateLayerInTree(
      this.appState.appViewSchema.layers,
      layer.id,
      updatedLayer,
    );

    const updatedLayersMap = this.layersEditor.updateLayersMap(updatedLayersTree, {});

    this.updateAppState({
      selectedLayer: updatedLayersMap[layer.id],
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayersTree,
        layersMap: updatedLayersMap,
      },
    });
  }

  private updateState(newState: AppState) {
    this._appState = newState;
    this.layers.set(this._appState.appViewSchema.layers);
    this.selectedlayer.set(this._appState.selectedLayer);
  }
}
