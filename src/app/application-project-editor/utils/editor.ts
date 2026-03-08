import { Layer } from '../types/application-editor.type';

export function generateUniqueId() {
  return 'layer-' + Math.random().toString(36).substr(2, 9);
}

export function layer(id: string, parentId = null, classNames = ''): Layer {
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
      class: classNames,
    },
    children: [],
  };
}

export function scaffoldLayer(): Layer {
  return {
    ...layer('scaffold', null),
    widgetReference: {
      ...layer('scaffold', null).widgetReference,
      propertyConfig: {
        styles: {
          backgroundColor: {
            nameOptions: ['white', 'blue', 'red', 'green', 'gray', 'cyan', 'black'],
            rangeOptions: [100, 200, 300, 400, 500, 600, 700, 800, 900],
          },
          color: {
            nameOptions: ['white', 'blue', 'red', 'green', 'gray', 'cyan', 'black'],
            rangeOptions: [100, 200, 300, 400, 500, 600, 700, 800, 900],
          },
        },
      },
      defaultWidgetPropertyModel: {
        class: 'pl-2 pr-2 min-h-48',
        styles: {
          backgroundColor: {
            name: 'white',
            range: null,
          },
          color: {
            name: 'black',
            range: null,
          },
        },
      },
    },
  };
}
