import { Injectable } from '@angular/core';
import { colorPalette, colorRange } from '../constants/application-editor.constant';
import { Widget } from '../types/application-editor.type';

@Injectable({
  providedIn: 'root',
})
export class WidgetsState {
  private _widgets: Widget[] = [
    {
      id: 'container-widget',
      widgetName: 'Container',
      widgetType: 'container',
      canNotBeAddedInside: (widget) => {
        return widget.widgetType === 'container';
      },
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
        class: 'pl-2 pr-2',
        styles: {},
      },
    },
    {
      id: 'section-widget',
      widgetName: 'Section',
      widgetType: 'section',
      canNotBeAddedInside: (widget) => {
        return widget.widgetType === 'section';
      },
      propertyConfig: {
        styles: {
          backgroundColor: {
            nameOptions: colorPalette,
            rangeOptions: colorRange,
          },
          background: {
            color: {
              name: colorPalette,
              range: colorRange,
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
      canNotBeAddedInside: (widget) => {
        return widget.widgetType === 'row'; // TBD;
      },
      defaultWidgetPropertyModel: {
        class: 'flex gap-x-2',
      },
    },
    {
      id: 'column-widget',
      widgetName: 'Column',
      widgetType: 'column',
      canNotBeAddedInside: (widget) => {
        return widget.widgetType === 'column'; // TBD;
      },
      defaultWidgetPropertyModel: {
        class: 'grow pl-2 pr-2',
      },
    },
    {
      id: 'heading-widget',
      widgetName: 'Heading',
      widgetType: 'heading',
      canNotBeAddedInside: (widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: 'font-bold text-2xl',
      },
      propertyConfig: {
        hasContent: true,
        styles: {
          color: {
            nameOptions: colorPalette,
            rangeOptions: colorRange,
          },
          textAlign: ['left', 'center', 'right', 'justify'],
        },
      },
    },
    {
      id: 'text-widget',
      widgetName: 'Text',
      widgetType: 'text',
      canNotBeAddedInside: (widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: '',
      },
      propertyConfig: {
        hasContent: true,
        styles: {
          color: {
            nameOptions: colorPalette,
            rangeOptions: colorRange,
          },
          textAlign: ['left', 'center', 'right', 'justify'],
        },
      },
    },
    {
      id: 'image-widget',
      widgetName: 'Image',
      widgetType: 'image',
      // renderContent:
      //   'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
      canNotBeAddedInside: (widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: 'min-h-48',
        src: '',
        alt: '',
      },
    },
    {
      id: 'link-widget',
      widgetName: 'Link',
      widgetType: 'link',
      canNotBeAddedInside: (widget) => {
        return true;
      },
      propertyConfig: {
        hasContent: true,
      },
      defaultWidgetPropertyModel: {
        class: 'underline',
        href: 'https://www.example.com',
        target: '_self',
      },
    },
    {
      id: 'link-button-widget',
      widgetName: 'LinkButton',
      widgetType: 'link',
      canNotBeAddedInside: (widget) => {
        return true;
      },
      propertyConfig: {
        hasContent: true,
      },
      defaultWidgetPropertyModel: {
        class: 'px-2 py-1 bg-blue-500 text-white rounded inline-flex items-center gap-x-1',
        href: 'https://www.example.com',
        target: '_self',
        content: 'Meditate',
      },
    },
    {
      id: 'icon-widget',
      widgetName: 'Icon',
      widgetType: 'icon',
      canNotBeAddedInside: (widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: '',
      },
    },
    {
      id: 'banner-widget',
      widgetName: 'Banner',
      widgetType: 'section',
      canNotBeAddedInside: (widget) => {
        return widget.widgetType === 'section';
      },
      propertyConfig: {
        styles: {
          background: {
            color: {
              name: colorPalette,
              range: colorRange,
            },
            image: '',
            position: ['center', 'top', 'bottom', 'left', 'right'],
            repeat: ['no-repeat', 'repeat'],
            size: ['cover', 'contain', 'auto'],
          },
          color: {
            nameOptions: colorPalette,
            rangeOptions: colorRange,
          },
          textAlign: ['left', 'center', 'right', 'justify'],
        },
      },
      defaultWidgetPropertyModel: {
        class: 'pt-20 pb-20',
        styles: {
          background: {
            image:
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFkaWF0aW9uJTIwYmFubmVyfGVufDB8fDB8fHww',
            repeat: 'no-repeat',
            size: 'cover',
          },
          textAlign: 'center',
          color: {
            name: 'white',
            range: null,
          },
        },
      },
      children: [
        {
          id: 'container-widget',
          widgetName: 'Container',
          widgetType: 'container',
          canNotBeAddedInside: (widget) => {
            return widget.widgetType === 'container';
          },
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
            class: 'pl-2 pr-2',
            styles: {},
          },
          children: [
            {
              id: 'heading-widget',
              widgetName: 'Heading',
              widgetType: 'heading',
              canNotBeAddedInside: (widget) => {
                return true;
              },
              defaultWidgetPropertyModel: {
                class: 'font-bold text-2xl mb-4',
                content: 'Discover Your Inner Peace with Our Meditation App',
              },
              propertyConfig: {
                hasContent: true,
                styles: {
                  color: {
                    nameOptions: colorPalette,
                    rangeOptions: colorRange,
                  },
                  textAlign: ['left', 'center', 'right', 'justify'],
                },
              },
            },
            {
              id: 'text-widget',
              widgetName: 'Text',
              widgetType: 'text',
              canNotBeAddedInside: (widget) => {
                return true;
              },
              defaultWidgetPropertyModel: {
                class: 'mb-4',
                content: 'Welcome to our website! We are glad to have you here.',
              },
              propertyConfig: {
                hasContent: true,
                styles: {
                  color: {
                    nameOptions: colorPalette,
                    rangeOptions: colorRange,
                  },
                  textAlign: ['left', 'center', 'right', 'justify'],
                },
              },
            },
            {
              id: 'link-button-widget',
              widgetName: 'LinkButton',
              widgetType: 'link',
              canNotBeAddedInside: (widget) => {
                return true;
              },
              propertyConfig: {
                hasContent: true,
              },
              defaultWidgetPropertyModel: {
                class: 'px-2 py-1 bg-blue-500 text-white rounded inline-flex items-center gap-x-1',
                href: 'https://www.example.com',
                target: '_self',
                content: 'Get Started',
              },
            },
          ],
        },
      ],
    },
  ];

  get widgets() {
    return this._widgets;
  }
}
