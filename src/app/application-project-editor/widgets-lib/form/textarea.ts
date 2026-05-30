import {
  TextareaWidget,
  TextareaWidgetPropertyModel,
} from '@app/application-project-editor/types/widget.type';

export function textareaWidget(model: Partial<TextareaWidgetPropertyModel> = {}): TextareaWidget {
  return {
    id: 'textarea-widget',
    widgetName: 'Textarea',
    widgetType: 'textarea',
    canNotBeAddedInside: (widget) => {
      return widget.widgetType !== 'form';
    },
    defaultWidgetPropertyModel: {
      defaultClass:
        'block w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
      class: '',
      ...model,
    } as TextareaWidgetPropertyModel,
    propertyConfig: {
      hasContent: true,
    },
  };
}
