import {
  ButtonWidget,
  ButtonWidgetPropertyModel,
  Widget,
} from '@app/application-project-editor/types/widget.type';

export function buttonWidget(
  children: Widget[] = [],
  model: Partial<ButtonWidgetPropertyModel> = {},
): ButtonWidget {
  return {
    id: 'button-widget',
    widgetName: 'Button',
    widgetType: 'button',
    propertyConfig: {
      hasContent: true,
    },
    defaultWidgetPropertyModel: {
      type: 'button',
      defaultClass:
        'px-4 py-1 bg-primary text-white text-nowrap rounded-theme inline-flex items-center gap-x-1',
      ...model,
    } as ButtonWidgetPropertyModel,
    children,
  };
}
