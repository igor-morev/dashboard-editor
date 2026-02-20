type SpaceValue = 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | {
  unit: 'px' | 'rem' | 'em';
  value: number; 
};

type Spaces = {
    x: SpaceValue;
    y: SpaceValue
  } | {
    left: SpaceValue;
    right: SpaceValue;
    top: SpaceValue;
    bottom: SpaceValue;
  };

type ColorName = 'red' | 'blue' | 'green' | 'yellow' | 'gray' | 'purple' | 'pink' | 'indigo' | 'teal' | 'cyan';
type ColorRange = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

type WidgetProperties = Partial<{
  styles: {
    backgroundColor: {
      name: ColorName;
      range: ColorRange;
      nameOptions: ColorName[];
      rangeOptions: ColorRange[];
    };
    color: {
      name: ColorName;
      range: ColorRange;
      nameOptions: ColorName[];
      rangeOptions: ColorRange[];
    };
    border: {
      color: {
        name: ColorName;
        range: ColorRange;
        nameOptions: ColorName[];
        rangeOptions: ColorRange[];
      },
      radius: 0 | 1 | 2 | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32;
      width: 0 | 1 | 2 | 4 | 8;
      style: 'solid' | 'dashed' | 'dotted';
    },
    padding: Spaces;
    margin: Spaces; 
  },
  class: string;
}>;

type TailwindWidgetProperties = Partial<{
  bg: string;
}>;

export interface Widget {
  id: string;
  widgetName: string;
  widgetType: 'scaffold' | 'container' | 'section' | 'column' | 'row' | 'text' | 'image';
  renderContent: string;
  defaultWidgetProperties: WidgetProperties;
  canNotBeAddedInside?: (widget: Widget) => boolean;
  canHaveChildren?: boolean;
}

export interface Page {
  id: string;
  pageName: string;
}

export interface Layer {
  id: string;
  sourceWidgetId: string;
  widgetReference: Widget;
  layerProperties: WidgetProperties;
  children: Layer[];
}

export interface AppState {
  pages: Page[];
  selectedPage: Page;
  selectedLayer: Layer | null;
  appViewSchema: {
    device: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    layers: Layer[];
    layersMap: Record<string, Layer>;
  }
}

export type EditorCommand = 'delete' | 'copy' | 'paste';
