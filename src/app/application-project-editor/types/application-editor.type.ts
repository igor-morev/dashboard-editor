interface AbstractBaseWidget {
  id: string;
  widgetName: string;
  widgetType: string;
  propertyConfig?: WidgetPropertyConfig;
  defaultWidgetPropertyModel: WidgetPropertyModel;
  canNotBeAddedInside?: (widget: Widget) => boolean;
  canHaveChildren?: boolean;
  children?: Widget[];
}

export interface GenericWidget extends AbstractBaseWidget {
  widgetType: 'scaffold' | 'container' | 'section' | 'column' | 'row' | 'text' | 'heading' | 'icon';
}

export interface LinkWidget extends AbstractBaseWidget {
  widgetType: 'link';
  defaultWidgetPropertyModel: LinkWidgetPropertyModel;
}

export interface ImageWidget extends AbstractBaseWidget {
  widgetType: 'image';
  defaultWidgetPropertyModel: ImageWidgetPropertyModel;
}

export type Widget = GenericWidget | LinkWidget | ImageWidget;

export interface Page {
  id: string;
  pageName: string;
}

export interface Layer {
  id: string;
  parentId: string | null;
  sourceWidgetId: string;
  widgetReference: Widget;
  layerPropertyModel: WidgetPropertyModel | LinkWidgetPropertyModel | ImageWidgetPropertyModel;
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

export type ColorName =
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
export type ColorRange = null | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type BackgroundPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type BackgroundRepeat = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
export type BackgroundSize = 'cover' | 'contain' | 'auto';

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

export type LinkWidgetPropertyModel = WidgetPropertyModel & {
  href: string;
  target: '_blank' | '_self' | '_parent' | '_top';
};

export type ImageWidgetPropertyModel = WidgetPropertyModel & {
  src: string;
  alt: string;
};
