import {
  TextInputWidget,
  TextInputWidgetPropertyModel,
} from '@app/application-project-editor/types/widget.type';

export function textInputWidget(
  model: Partial<TextInputWidgetPropertyModel> = {},
): TextInputWidget {
  return {
    id: 'text-input-widget',
    widgetName: 'Text Input',
    widgetType: 'text-input',
    canNotBeAddedInside: (widget) => {
      return widget.widgetType !== 'form';
    },
    defaultWidgetPropertyModel: {
      defaultClass:
        'block w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
      class: '',
      ...model,
    } as TextInputWidgetPropertyModel,
    propertyConfig: {
      hasContent: true,
    },
  };
}
