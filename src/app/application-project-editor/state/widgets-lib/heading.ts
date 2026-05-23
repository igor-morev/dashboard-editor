import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import {
  Widget,
  WidgetPropertyModel,
} from '@app/application-project-editor/types/application-editor.type';

export function headingWidget(model: WidgetPropertyModel = {}): Widget {
  return {
    id: 'heading-widget',
    widgetName: 'Heading',
    widgetType: 'heading',
    canNotBeAddedInside: (widget) => {
      return true;
    },
    defaultWidgetPropertyModel: {
      defaultClass: 'font-heading font-black',
      class: '',
      ...model,
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
