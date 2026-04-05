import {
  LinkWidget,
  LinkWidgetPropertyModel,
} from '@app/application-project-editor/types/application-editor.type';

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
      class: 'px-2 py-1 bg-blue-500 text-white rounded inline-flex items-center gap-x-1',
      target: '_self',
      href: '#',
      ...model,
    },
  };
}
