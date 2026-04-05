import {
  Widget,
  WidgetPropertyModel,
} from '@app/application-project-editor/types/application-editor.type';

export function columnWidget(children: Widget[] = [], model: WidgetPropertyModel = {}): Widget {
  return {
    id: 'column-widget',
    widgetName: 'Column',
    widgetType: 'column',
    canNotBeAddedInside: (widget) => {
      return widget.widgetType === 'column'; // TBD;
    },
    defaultWidgetPropertyModel: {
      class: 'grow pl-2 pr-2',
      ...model,
    },
    children,
  };
}
