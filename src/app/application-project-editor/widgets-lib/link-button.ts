import {
  LinkWidget,
  LinkWidgetPropertyModel,
} from '@app/application-project-editor/types/widget.type';

export function linkButtonWidget(model: Partial<LinkWidgetPropertyModel> = {}): LinkWidget {
  return {
    id: 'link-button-widget',
    widgetName: 'LinkButton',
    widgetType: 'link',
    canNotBeAddedInside: (widget) => {
      return true;
    },
    propertyConfig: {
      hasContent: true,
    },
    defaultWidgetPropertyModel: {
      defaultClass:
        'px-4 py-1 bg-primary text-white text-nowrap rounded-theme inline-flex items-center gap-x-1',
      target: '_self',
      href: '#',
      ...model,
    },
  };
}
