import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { Widget } from '@app/application-project-editor/types/widget.type';

export function containerWidget(
  children: Widget[] = [],
  model: Widget['defaultWidgetPropertyModel'] = {},
): Widget {
  return {
    id: 'container-widget',
    widgetName: 'Container',
    widgetType: 'container',
    canNotBeAddedInside: (widget) => {
      return widget.widgetType === 'container';
    },
    propertyConfig: {
      styles: {
        backgroundColor: {
          nameOptions: colorPalette,
          rangeOptions: colorRange,
        },
        color: {
          nameOptions: colorPalette,
          rangeOptions: colorRange,
        },
      },
    },
    defaultWidgetPropertyModel: {
      defaultClass: 'pl-3 pr-3',
      class: 'pl-3 pr-3',
      styles: {},
      ...model,
    },
    children: children,
  };
}
