import { WidgetPropertyModel, Widget } from '@app/application-project-editor/types/widget.type';

export function rowWidget(children: Widget[] = [], model: WidgetPropertyModel = {}): Widget {
  return {
    id: 'row-widget',
    widgetName: 'Row',
    widgetType: 'row',
    canNotBeAddedInside: (widget) => {
      return widget.widgetType === 'row'; // TBD;
    },
    defaultWidgetPropertyModel: {
      defaultClass: 'flex gap-4 w-full',
      class: 'flex gap-4',
      ...model,
    },
    children,
  };
}
