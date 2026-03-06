import { Layer } from '../types/application-editor.type';

export function generateUniqueId() {
  return 'layer-' + Math.random().toString(36).substr(2, 9);
}

export function layer(id: string, parentId = null): Layer {
  return {
    id,
    parentId,
    sourceWidgetId: 'scaffold-widget',
    widgetReference: {
      id: 'scaffold-widget',
      widgetName: 'Scaffold',
      widgetType: 'scaffold',
      renderContent: 'div',
      defaultWidgetPropertyModel: {},
    },
    layerPropertyModel: {
      class: '',
    },
    children: [],
  };
}
