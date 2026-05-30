import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { Widget } from '@app/application-project-editor/types/widget.type';

export function listWidget(children: Widget[], customClass?: string): Widget {
  return {
    id: 'list-widget',
    widgetName: 'List',
    widgetType: 'list',
    canNotBeAddedInside: () => {
      return true;
    },
    propertyConfig: {
      styles: {
        color: {
          nameOptions: colorPalette,
          rangeOptions: colorRange,
        },
      },
    },
    defaultWidgetPropertyModel: {
      class: `list-disc list-inside ${customClass || ''}`,
    },
    children,
  };
}
