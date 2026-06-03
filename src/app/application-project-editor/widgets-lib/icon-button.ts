import {
  ButtonWidget,
  ButtonWidgetPropertyModel,
  Widget,
} from '@app/application-project-editor/types/widget.type';

export function iconButtonWidget(
  children: Widget[] = [],
  model: Partial<ButtonWidgetPropertyModel> = {},
): ButtonWidget {
  return {
    id: 'icon-button-widget',
    widgetName: 'Button',
    widgetType: 'button',
    propertyConfig: {
      hasContent: true,
    },
    defaultWidgetPropertyModel: {
      defaultClass: 'px-1 py-1 rounded-theme inline-flex items-center gap-x-1',
      ...model,
    } as ButtonWidgetPropertyModel,
    children,
  };
}
