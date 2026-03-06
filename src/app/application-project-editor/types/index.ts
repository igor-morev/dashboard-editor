import { AppState, Layer, Widget, WidgetPropertyModel } from './application-editor.type';

interface WidgetsList {
  widgets: Widget[];

  loadWidgets(): void;
}

interface PagesList {
  pages: AppState['pages'];
  selectedPage: AppState['selectedPage'];

  selectPage(pageId: string): void;
  createPage(pageName: string): void;
  removePage(pageId: string): void;
  updatePage(pageId: string, properties: Partial<AppState['selectedPage']>): void;
}

// TBD: we might want to have a separate state manager for layers, to handle the complexity of undo/redo and history management, and keep the AppState simpler.
interface AppBuilderStateManager {
  appState: AppState;
  historyState: AppState[];

  updateState(newState: Partial<AppState>): void;
  saveLayerState(layer: Layer): void;
  updateLayersState(layers: Layer[]): void;

  updateSelectedLayerState(properties: Partial<Layer['layerPropertyModel']>): void;

  undo(): void;
  redo(): void;
}

interface LayerBuilderService {
  appBuilderStateManager: AppBuilderStateManager;
  layers: Layer[];

  createLayer(widget: Widget): void;
  selectLayer(layer: Layer): void;
  highlightLayer(layer: Layer): void;
  updateLayer(layer: Layer, properties: Partial<Layer['layerPropertyModel']>): void;
  copyLayer(layer: Layer): void;
  pasteLayer(destinationLayer: Layer): void;
  removeLayer(layer: Layer): void;
}

interface Scaffold {
  layers: Layer[];

  renderLayer(layer: Layer): string;
  selectLayer(layer: Layer): void;
  highlightLayer(layer: Layer): void;
}

export interface ILayerPropertyConverter {
  convertToScaffoldClasses(propertyModel: WidgetPropertyModel): string;
}

interface LayerTree {
  layers: Layer[];
  layersBuilder: LayerBuilderService;

  selectLayer(layer: Layer): void;
  highlightLayer(layer: Layer): void;
  removeLayer(layer: Layer): void;
}
