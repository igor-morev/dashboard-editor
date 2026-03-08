import { Injectable, signal } from '@angular/core';
import { AppState, Widget } from '../types/application-editor.type';
import { layer, scaffoldLayer } from '../utils/editor';

@Injectable()
export class ApplicationEditorState {
  private _appState: AppState = {
    pages: [
      {
        id: 'page-1',
        pageName: 'Home Page',
      },
      {
        id: 'page-2',
        pageName: 'Contacts Page',
      },
    ],
    selectedPage: {
      id: 'page-1',
      pageName: 'Home Page',
    },
    selectedLayer: scaffoldLayer(),
    appViewSchema: {
      device: 'sm',
      layers: [scaffoldLayer()],
      layersMap: {
        scaffold: scaffoldLayer(),
      },
    },
  };

  get appState() {
    return this._appState;
  }

  layers = signal(this._appState.appViewSchema.layers);
  selectedlayer = signal(this._appState.selectedLayer);
  highlightedLayer = signal(this._appState.highlightedLayer);

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
      propertyConfig: {
        styles: {
          backgroundColor: {
            nameOptions: ['blue', 'red', 'green', 'gray', 'cyan'],
            rangeOptions: [100, 200, 300, 400, 500, 600, 700, 800, 900],
          },
          color: {
            nameOptions: ['blue', 'red', 'green', 'gray', 'cyan'],
            rangeOptions: [100, 200, 300, 400, 500, 600, 700, 800, 900],
          },
        },
      },
      defaultWidgetPropertyModel: {
        class: 'pl-2 pr-2',
        styles: {
          // backgroundColor: {
          //   name: 'green',
          //   range: 400,
          // },
        },
      },
    },
    {
      id: 'section-widget',
      widgetName: 'Section',
      widgetType: 'section',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'section';
      },
      propertyConfig: {
        styles: {
          backgroundColor: {
            nameOptions: ['blue', 'red', 'green', 'gray', 'cyan'],
            rangeOptions: [100, 200, 300, 400, 500, 600, 700, 800, 900],
          },
          background: {
            color: {
              name: ['blue', 'red', 'green', 'gray', 'cyan'],
              range: [100, 200, 300, 400, 500, 600, 700, 800, 900],
            },
            image: '',
            position: ['center', 'top', 'bottom', 'left', 'right'],
            repeat: ['no-repeat', 'repeat'],
            size: ['cover', 'contain', 'auto'],
          },
          textAlign: ['left', 'center', 'right', 'justify'],
        },
      },
      defaultWidgetPropertyModel: {
        class: 'pt-4 pb-4',
        styles: {
          background: {
            repeat: 'no-repeat',
          },
        },
      },
    },
    {
      id: 'row-widget',
      widgetName: 'Row',
      widgetType: 'row',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'row'; // TBD;
      },
      defaultWidgetPropertyModel: {
        class: 'min-h-48 bg-red-300 flex gap-x-2',
      },
    },
    {
      id: 'column-widget',
      widgetName: 'Column',
      widgetType: 'column',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'column'; // TBD;
      },
      defaultWidgetPropertyModel: {
        class: 'min-h-48 bg-green-300 grow pl-2 pr-2',
      },
    },
    {
      id: 'heading-widget',
      widgetName: 'Heading',
      widgetType: 'heading',
      renderContent: '2334',
      canNotBeAddedInside: (widget: Widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: 'font-bold text-2xl',
      },
      propertyConfig: {
        hasContent: true,
        styles: {
          color: {
            nameOptions: ['blue', 'red', 'green', 'gray', 'cyan'],
            rangeOptions: [100, 200, 300, 400, 500, 600, 700, 800, 900],
          },
          textAlign: ['left', 'center', 'right', 'justify'],
        },
      },
    },
    {
      id: 'text-widget',
      widgetName: 'Text',
      widgetType: 'text',
      renderContent: '',
      canNotBeAddedInside: (widget: Widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: '',
      },
      propertyConfig: {
        hasContent: true,
        styles: {
          color: {
            nameOptions: ['blue', 'red', 'green', 'gray', 'cyan'],
            rangeOptions: [100, 200, 300, 400, 500, 600, 700, 800, 900],
          },
          textAlign: ['left', 'center', 'right', 'justify'],
        },
      },
    },
    {
      id: 'image-widget',
      widgetName: 'Image',
      widgetType: 'image',
      renderContent:
        'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
      canNotBeAddedInside: (widget: Widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: 'min-h-48',
      },
    },
    {
      id: 'icon-widget',
      widgetName: 'Icon',
      widgetType: 'icon',
      renderContent:
        'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
      canNotBeAddedInside: (widget: Widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: '',
      },
    },
  ];

  get widgets() {
    return this._widgets;
  }

  updateAppState(newState: Partial<AppState>) {
    this._appState = {
      ...this.appState,
      ...newState,
    };

    this.layers.set(this._appState.appViewSchema.layers);
    this.selectedlayer.set(this._appState.selectedLayer);
    this.highlightedLayer.set(this._appState.highlightedLayer);

    console.log('updated app state', this._appState);
  }
}
