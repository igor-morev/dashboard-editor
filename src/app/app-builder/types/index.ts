import { AppState, Layer, Widget } from "./app-builder.type";

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
  historyState: any[];

  updateState(newState: Partial<AppState>): void;
  saveLayerState(layer: Layer): void;
  updateLayersState(layers: Layer[]): void;

  updateSelectedLayerState(properties: Partial<Layer['layerProperties']>): void;

  undo(): void;
  redo(): void;
}

interface LayerBuilderService {
  appBuilderStateManager: AppBuilderStateManager;
  layers: Layer[];

  createLayer(widget: Widget): void;
  selectLayer(layer: Layer): void;
  highlightLayer(layer: Layer): void;
  updateLayer(layer: Layer, properties: Partial<Layer['layerProperties']>): void;
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


interface LayerPropertiesConverter {
  convertToScaffoldClasses(layerProperties: Layer['layerProperties']): string;
}

// example implementation of LayerPropertiesConverter that converts layer properties to Tailwind CSS classes
class TailwindLayerPropertiesConverter implements LayerPropertiesConverter {
  convertToScaffoldClasses(layerProperties: Layer['layerProperties']): string {
    // This is a very basic implementation. You would need to expand this to cover all the properties you want to support.
    let classes = layerProperties.class || '';
    
    if (layerProperties.styles?.backgroundColor) {
      classes += ` bg-${layerProperties.styles.backgroundColor}`;
    }

    return classes.trim();
  }
}

interface LayerTree {
  layers: Layer[];
  layersBuilder: LayerBuilderService;

  selectLayer(layer: Layer): void;
  highlightLayer(layer: Layer): void;
  removeLayer(layer: Layer): void;
}