import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import {
  Widget,
  WidgetPropertyModel,
} from '@app/application-project-editor/types/application-editor.type';

export function textWidget(defaultWidgetPropertyModel: WidgetPropertyModel = {}): Widget {
  return {
    id: 'text-widget',
    widgetName: 'Text',
    widgetType: 'text',
    canNotBeAddedInside: (widget) => {
      return true;
    },
    defaultWidgetPropertyModel: {
      class: 'text-base mb-2',
      ...defaultWidgetPropertyModel,
    },
    propertyConfig: {
      hasContent: true,
      styles: {
        color: {
          nameOptions: colorPalette,
          rangeOptions: colorRange,
        },
        textAlign: ['left', 'center', 'right', 'justify'],
      },
    },
  };
}
