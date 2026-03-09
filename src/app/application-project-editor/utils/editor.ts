import { colorPalette, colorRange } from '../constants/application-editor.constant';
import { Layer, Widget } from '../types/application-editor.type';

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
            nameOptions: colorPalette,
            rangeOptions: colorRange,
          },
          color: {
            nameOptions: colorPalette,
            rangeOptions: colorRange,
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
    } as Widget,
  };
}
