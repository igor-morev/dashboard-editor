import {
  FormElementWidget,
  FormWidget,
  FormWidgetPropertyModel,
} from '@app/application-project-editor/types/widget.type';

export function formWidget(
  children: FormElementWidget[] = [],
  model: Partial<FormWidgetPropertyModel> = {},
): FormWidget {
  return {
    id: 'form-widget',
    widgetName: 'Form',
    widgetType: 'form',
    canNotBeAddedInside: (widget) => {
      return widget.widgetType === 'form';
    },
    defaultWidgetPropertyModel: {
      defaultClass: 'w-full',
      class: '',
      ...model,
    } as FormWidgetPropertyModel,
    propertyConfig: {
      hasContent: false,
    },
    children,
  };
}
