import { Injectable, signal } from '@angular/core';
import { AppState, Widget } from '../types/application-editor.type';
import { layer } from '../utils/editor';

@Injectable()
export class ApplicationEditorState {
  private _appState: AppState = {
    pages: [
      {
        id: 'page-1',
        pageName: 'Home Page'
      },
      {
        id: 'page-2',
        pageName: 'Contacts Page'
      }
    ],
    selectedPage: {
      id: 'page-1',
      pageName: 'Home Page'
    },
    selectedLayer: layer('scaffold'),
    appViewSchema: {
      device: 'sm',
      layers: [
        layer('scaffold')
      ],
      layersMap: {
        'scaffold': layer('scaffold')
      }
    }
  };

  get appState() {
    return this._appState;
  }

  layers = signal(this._appState.appViewSchema.layers);
  selectedlayer = signal(this._appState.selectedLayer);


  get pages() {
    return this._appState.pages;
  }

  private _widgets: Widget[] = [
    {
      id: 'container-widget',
      widgetName: 'Container',
      widgetType: 'container',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'container';
      },
      defaultWidgetPropertyModel: {
        class: 'pl-2 pr-2 bg-blue-300 min-h-48',
      }
    },
    {
      id: 'section-widget',
      widgetName: 'Section',
      widgetType: 'section',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'section';
      },
      defaultWidgetPropertyModel: {
        class: 'min-h-48 bg-gray-300',
      }
    },
    {
      id: 'row-widget',
      widgetName: 'Row',
      widgetType: 'row',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'row' // TBD;
      },
      defaultWidgetPropertyModel: {
        class: 'min-h-48 bg-red-300 flex gap-x-2',
      }
    },
    {
      id: 'column-widget',
      widgetName: 'Column',
      widgetType: 'column',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'column' // TBD;
      },
      defaultWidgetPropertyModel: {
        class: 'min-h-48 bg-green-300 grow pl-2 pr-2',
      }
    },
    {
      id: 'heading-widget',
      widgetName: 'Heading',
      widgetType: 'heading',
      renderContent: 'h1',
      canNotBeAddedInside: (widget: Widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: '',
      }
    },
    {
      id: 'text-widget',
      widgetName: 'Text',
      widgetType: 'text',
      renderContent: 'Some text',
      canNotBeAddedInside: (widget: Widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: '',
      }
    },
    {
      id: 'image-widget',
      widgetName: 'Image',
      widgetType: 'image',
      renderContent: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
      canNotBeAddedInside: (widget: Widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: 'min-h-48',
      }
    },
    {
      id: 'icon-widget',
      widgetName: 'Icon',
      widgetType: 'icon',
      renderContent: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
      canNotBeAddedInside: (widget: Widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: '',
      }
    }
  ];

  get widgets() {
    return this._widgets;
  }

  updateAppState(newState: Partial<AppState>) {
    this._appState = {
      ...this.appState,
      ...newState
    }

    this.layers.set(this._appState.appViewSchema.layers);
    this.selectedlayer.set(this._appState.selectedLayer);
  }
}
