import { Widget } from "../types/widget.type";

export function blockWidget(children: Widget[] = [], model = {}): Widget {
  return {
    id: 'block-widget',
    widgetName: 'Block',
    widgetType: 'block',
    canNotBeAddedInside: (widget: Widget) => {
      return widget.widgetType === 'block'; // TBD;
    },
    defaultWidgetPropertyModel: {
      defaultClass: '@block',
      class: '',
      ...model,
    },
    children,
  };
}