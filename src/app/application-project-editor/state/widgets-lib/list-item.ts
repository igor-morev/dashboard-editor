import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { Widget } from '@app/application-project-editor/types/application-editor.type';

export function listItemWidget(children?: Widget): Widget {
  return {
    id: 'list-item-widget',
    widgetName: 'ListItem',
    widgetType: 'list-item',
    canNotBeAddedInside: (widget) => {
      return true;
    },
    propertyConfig: {
      styles: {
        color: {
          nameOptions: colorPalette,
          rangeOptions: colorRange,
        },
      },
      hasContent: true,
    },
    defaultWidgetPropertyModel: {
      content: 'List Item',
    },
    children: children ? [children] : [],
  };
}
