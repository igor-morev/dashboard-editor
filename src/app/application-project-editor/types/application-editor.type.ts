type SpaceValue =
  | 2
  | 4
  | 6
  | 8
  | 10
  | 12
  | 14
  | 16
  | 20
  | 24
  | 28
  | 32
  | {
      unit: 'px' | 'rem' | 'em';
      value: number;
    };

type Spaces =
  | {
      x: SpaceValue;
      y: SpaceValue;
    }
  | {
      left: SpaceValue;
      right: SpaceValue;
      top: SpaceValue;
      bottom: SpaceValue;
    };

type ColorName =
  | 'white'
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'gray'
  | 'purple'
  | 'pink'
  | 'indigo'
  | 'teal'
  | 'cyan'
  | 'black';
type ColorRange = null | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

type TextAlign = 'left' | 'center' | 'right' | 'justify';
type BackgroundPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
type BackgroundRepeat = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
type BackgroundSize = 'cover' | 'contain' | 'auto';

type WidgetPropertyConfig = Partial<{
  styles: Partial<{
    backgroundColor: {
      nameOptions: ColorName[];
      rangeOptions: ColorRange[];
    };
    background: {
      color: {
        name: ColorName[];
        range: ColorRange[];
      };
      image: string;
      position: BackgroundPosition[];
      repeat: BackgroundRepeat[];
      size: BackgroundSize[];
    };
    color: {
      nameOptions: ColorName[];
      rangeOptions: ColorRange[];
    };
    border: {
      color: {
        nameOptions: ColorName[];
        rangeOptions: ColorRange[];
      };
      radius: {
        visible: boolean;
      };
      width: {
        visible: boolean;
      };
      style: {
        visible: boolean;
      };
    };
    padding: {
      visible: boolean;
    };
    margin: {
      visible: boolean;
    };
    textAlign: TextAlign[];
  }>;
  class: string;
  hasContent: boolean;
}>;

export type WidgetPropertyModel = Partial<{
  styles: Partial<{
    backgroundColor: {
      name: ColorName;
      range: ColorRange;
    };
    background: Partial<{
      color: {
        name: ColorName;
        range: ColorRange;
      };
      image: string;
      position: BackgroundPosition;
      repeat: BackgroundRepeat;
      size: BackgroundSize;
    }>;
    color: {
      name: ColorName;
      range: ColorRange;
    };
    border: {
      color: {
        name: ColorName;
        range: ColorRange;
      };
      radius: 0 | 1 | 2 | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32;
      width: 0 | 1 | 2 | 4 | 8;
      style: 'solid' | 'dashed' | 'dotted';
    };
    padding: Spaces;
    margin: Spaces;
    textAlign: TextAlign;
  }>;
  class: string;
  content?: string;
}>;

type TailwindWidgetProperties = Partial<{
  bg: string;
}>;

export interface Widget {
  id: string;
  widgetName: string;
  widgetType:
    | 'scaffold'
    | 'container'
    | 'section'
    | 'column'
    | 'row'
    | 'text'
    | 'heading'
    | 'image'
    | 'icon';
  renderContent: string;
  propertyConfig?: WidgetPropertyConfig;
  defaultWidgetPropertyModel: WidgetPropertyModel;
  canNotBeAddedInside?: (widget: Widget) => boolean;
  canHaveChildren?: boolean;
}

export interface Page {
  id: string;
  pageName: string;
}

export interface Layer {
  id: string;
  parentId: string | null;
  sourceWidgetId: string;
  widgetReference: Widget;
  layerPropertyModel: WidgetPropertyModel;
  children: Layer[];
}

export interface AppState {
  pages: Page[];
  selectedPage: Page;
  selectedLayer: Layer;
  highlightedLayer?: Layer;
  appViewSchema: {
    device: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    layers: Layer[];
    layersMap: Record<string, Layer>;
  };
}

export type EditorCommand = 'delete' | 'copy' | 'paste';
