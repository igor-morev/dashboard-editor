import {
  SelectInputWidgetPropertyModel,
  SelectInputWidget,
} from '@app/application-project-editor/types/widget.type';

export function selectInputWidget(
  model: Partial<SelectInputWidgetPropertyModel> = {},
): SelectInputWidget {
  return {
    id: 'select-input-widget',
    widgetName: 'Select Input',
    widgetType: 'select-input',
    canNotBeAddedInside: (widget) => {
      return widget.widgetType !== 'form';
    },
    defaultWidgetPropertyModel: {
      defaultClass:
        'block w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
      class: '',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
      ...model,
    } as SelectInputWidgetPropertyModel,
    propertyConfig: {
      // hasContent: true,
    },
  };
}
