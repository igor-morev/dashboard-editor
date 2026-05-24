import { colorPalette, colorRange } from '../constants/application-editor.constant';
import { Layer } from '../types/project.type';
import { Widget } from '../types/widget.type';

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
      defaultWidgetPropertyModel: {
        defaultClass: 'font-body color-primary bg-surface text-project-body',
      },
    },
    layerPropertyModel: {},
    children: [],
    index: 0,
    isVisible: true,
    locked: false,
  };
}

export function scaffoldLayer(): Layer {
  return {
    ...layer('scaffold'),
    locked: true,
    widgetReference: {
      ...layer('scaffold').widgetReference,
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
        // styles: {
        //   backgroundColor: {
        //     name: 'gray',
        //     range: 100,
        //   },
        //   color: {
        //     name: 'black',
        //     range: null,
        //   },
        // },
      },
    } as Widget,
    layerPropertyModel: layer('scaffold').widgetReference.defaultWidgetPropertyModel,
  };
}
