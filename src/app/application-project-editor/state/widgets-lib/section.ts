import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { Widget, WidgetPropertyModel } from '@app/application-project-editor/types/widget.type';

export function sectionWidget(children: Widget[] = [], model: WidgetPropertyModel = {}): Widget {
  return {
    id: 'section-widget',
    widgetName: 'Section',
    widgetType: 'section',
    canNotBeAddedInside: (widget) => {
      return widget.widgetType === 'section';
    },
    propertyConfig: {
      styles: {
        backgroundColor: {
          nameOptions: colorPalette,
          rangeOptions: colorRange,
        },
        background: {
          color: {
            name: colorPalette,
            range: colorRange,
          },
          image: '',
          position: ['center', 'top', 'bottom', 'left', 'right'],
          repeat: ['no-repeat', 'repeat'],
          size: ['cover', 'contain', 'auto'],
        },
        textAlign: ['left', 'center', 'right', 'justify'],
      },
    },
    defaultWidgetPropertyModel: {
      defaultClass: 'py-12',
      styles: {
        background: {
          repeat: 'no-repeat',
        },
      },
      ...model,
    },
    children,
  };
}
