import { Widget } from '@app/application-project-editor/types/application-editor.type';

export function linkWidget(content?: string): Widget {
  return {
    id: 'link-widget',
    widgetName: 'Link',
    widgetType: 'link',
    canNotBeAddedInside: () => {
      return true;
    },
    propertyConfig: {
      hasContent: true,
    },
    defaultWidgetPropertyModel: {
      class: '',
      href: 'https://www.example.com',
      target: '_self',
      content,
    },
  };
}
