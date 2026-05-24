import {
  ButtonWidget,
  ButtonWidgetPropertyModel,
} from '@app/application-project-editor/types/widget.type';

export function buttonWidget(model: Partial<ButtonWidgetPropertyModel> = {}): ButtonWidget {
  return {
    id: 'button-widget',
    widgetName: 'Button',
    widgetType: 'button',
    canNotBeAddedInside: (widget) => {
      return true;
    },
    propertyConfig: {
      hasContent: true,
    },
    defaultWidgetPropertyModel: {
      defaultClass:
        'px-2 py-1 bg-primary text-white rounded-theme inline-flex items-center gap-x-1',
      ...model,
    } as ButtonWidgetPropertyModel,
  };
}
