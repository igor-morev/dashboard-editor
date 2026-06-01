import { inject, Injectable, signal } from '@angular/core';
import { scaffoldLayer } from '../utils/editor';
import { HistoryEditorState } from './history-state';
import { LayersEditor } from '../services/layers-editor';
import { AppState, Layer } from '../types/project.type';

@Injectable({
  providedIn: 'root',
})
export class ApplicationEditorState {
  private layersEditor = inject(LayersEditor);
  private historyState = inject(HistoryEditorState);

  private _appState: AppState = {
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

  resetAppState() {
    const initialState: AppState = {
      pages: [
        {
          id: 'page-1',
          pageName: 'Home Landing Page',
        },
        {
          id: 'page-2',
          pageName: 'Contacts Page',
        },
      ],
      selectedPage: {
        id: 'page-1',
        pageName: 'Home Landing Page',
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

    console.log('Updated App State:', this.appState);
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
