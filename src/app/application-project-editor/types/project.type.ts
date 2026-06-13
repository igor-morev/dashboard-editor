import {
  Widget,
  WidgetPropertyModel,
  LinkWidgetPropertyModel,
  ImageWidgetPropertyModel,
  FormElementWidget,
} from './widget.type';

export interface Page {
  id: string;
  pageName: string;
}

export interface Layer {
  id: string;
  parentId: string | null;
  sourceWidgetId: string;
  widgetReference: Widget;
  layerPropertyModel:
    | WidgetPropertyModel
    | LinkWidgetPropertyModel
    | ImageWidgetPropertyModel
    | FormElementWidget['defaultWidgetPropertyModel'];
  children: Layer[];
  index: number;
  isVisible: boolean;
  locked: boolean;
  layerName?: string;
}

export interface AppViewSchema {
  device: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  layers: Layer[];
  layersMap: Record<string, Layer>;
}

export interface AppState {
  pages: Page[];
  selectedPage: Page;
  selectedLayer: Layer;
  appViewSchema: AppViewSchema;
}

export type EditorCommand = 'delete' | 'copy' | 'paste' | 'duplicate';
