import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import {
  Widget,
  WidgetPropertyModel,
} from '@app/application-project-editor/types/application-editor.type';

export function iconWidget(model: WidgetPropertyModel = {}): Widget {
  return {
    id: 'icon-widget',
    widgetName: 'Icon',
    widgetType: 'icon',
    canNotBeAddedInside: (widget) => {
      return true;
    },
    propertyConfig: {
      hasContent: true,
      styles: {
        color: {
          nameOptions: colorPalette,
          rangeOptions: colorRange,
        },
      },
    },
    defaultWidgetPropertyModel: {
      ...model,
    },
  };
}
