import {
  ColorName,
  ColorRange,
  BackgroundPosition,
  BackgroundRepeat,
  BackgroundSize,
  TextAlign,
  Spaces,
} from './config.type';

interface AbstractBaseWidget {
  id: string;
  widgetName: string;
  widgetType: string;
  propertyConfig?: WidgetPropertyConfig;
  defaultWidgetPropertyModel: WidgetPropertyModel;
  canNotBeAddedInside?: (widget: Widget) => boolean;
  layoutTransformer?: (
    layout: string | undefined,
    content?: string | Record<string, any>,
  ) => Widget[];
  children?: Widget[];
}

export interface GenericWidget extends AbstractBaseWidget {
  widgetType:
    | 'scaffold'
    | 'container'
    | 'section'
    | 'column'
    | 'row'
    | 'text'
    | 'heading'
    | 'icon'
    | 'list'
    | 'list-item'
    | 'header'
    | 'footer'
    | 'block'
    | 'button'
    | 'text-input'
    | 'file-input'
    | 'select-input'
    | 'textarea'
    | 'form';
}

export interface LinkWidget extends AbstractBaseWidget {
  widgetType: 'link';
  defaultWidgetPropertyModel: LinkWidgetPropertyModel;
}

export interface ImageWidget extends AbstractBaseWidget {
  widgetType: 'image';
  defaultWidgetPropertyModel: ImageWidgetPropertyModel;
}

export interface FormWidget extends AbstractBaseWidget {
  widgetType: 'form';
  defaultWidgetPropertyModel: FormWidgetPropertyModel;
}

export interface TextInputWidget extends AbstractBaseWidget {
  widgetType: 'text-input';
  defaultWidgetPropertyModel: TextInputWidgetPropertyModel;
}

export interface FileInputWidget extends AbstractBaseWidget {
  widgetType: 'file-input';
  defaultWidgetPropertyModel: FileInputWidgetPropertyModel;
}

export interface SelectInputWidget extends AbstractBaseWidget {
  widgetType: 'select-input';
  defaultWidgetPropertyModel: SelectInputWidgetPropertyModel;
}

export interface TextareaWidget extends AbstractBaseWidget {
  widgetType: 'textarea';
  defaultWidgetPropertyModel: TextareaWidgetPropertyModel;
}

export interface ButtonWidget extends AbstractBaseWidget {
  widgetType: 'button';
  defaultWidgetPropertyModel: ButtonWidgetPropertyModel;
}

export type FormElementWidget =
  | TextInputWidget
  | FileInputWidget
  | SelectInputWidget
  | TextareaWidget
  | ButtonWidget
  | GenericWidget;

export type Widget = GenericWidget | LinkWidget | ImageWidget;

export type WidgetPropertyConfig = Partial<{
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
  layout?: {
    options: string[];
  };
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
      radius: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      style: 'solid' | 'dashed' | 'dotted';
    };
    padding: Spaces;
    margin: Spaces;
    textAlign: TextAlign;
  }>;
  defaultClass?: string;
  class: string;
  layout?: string;
  content?: string | Record<string, any>;
  onUpdate(value: string): void;
}>;

export type LinkWidgetPropertyModel = WidgetPropertyModel & {
  href: string;
  target: '_blank' | '_self' | '_parent' | '_top';
};

export type ImageWidgetPropertyModel = WidgetPropertyModel & {
  src: string;
  alt: string;
};

export type TextInputWidgetPropertyModel = WidgetPropertyModel & {
  inputType: 'text' | 'email' | 'password' | 'number' | 'tel';
  label: string;
  placeholder: string;
  name: string;
  required: boolean;
};

export type FileInputWidgetPropertyModel = WidgetPropertyModel & {
  multiple: boolean;
  label: string;
  name: string;
  required: boolean;
};

export type SelectInputWidgetPropertyModel = WidgetPropertyModel & {
  multiple: boolean;
  label: string;
  name: string;
  required: boolean;
  options: string[];
};

export type TextareaWidgetPropertyModel = WidgetPropertyModel & {
  label: string;
  placeholder: string;
  name: string;
  required: boolean;
};

export type ButtonWidgetPropertyModel = WidgetPropertyModel & {
  type: 'button' | 'submit';
};

export type FormWidgetPropertyModel = WidgetPropertyModel & {
  action: string;
  method: 'GET' | 'POST';
};
