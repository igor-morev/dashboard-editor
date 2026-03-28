import { Injectable } from '@angular/core';
import { colorPalette, colorRange } from '../constants/application-editor.constant';
import { Widget } from '../types/application-editor.type';

function linkWidget(content?: string): Widget {
  return {
    id: 'link-widget',
    widgetName: 'Link',
    widgetType: 'link',
    canNotBeAddedInside: () => {
      return true;
    },
    propertyConfig: {
      hasContent: true,
    },
    defaultWidgetPropertyModel: {
      class: '',
      href: 'https://www.example.com',
      target: '_self',
      content,
    },
  };
}

function listItemWidget(children?: Widget): Widget {
  return {
    id: 'list-item-widget',
    widgetName: 'ListItem',
    widgetType: 'list-item',
    canNotBeAddedInside: (widget) => {
      return true;
    },
    propertyConfig: {
      styles: {
        color: {
          nameOptions: colorPalette,
          rangeOptions: colorRange,
        },
      },
      hasContent: true,
    },
    defaultWidgetPropertyModel: {
      content: 'List Item',
    },
    children: children ? [children] : [],
  };
}

function listWidget(children: Widget[], customClass?: string): Widget {
  return {
    id: 'list-widget',
    widgetName: 'List',
    widgetType: 'list',
    canNotBeAddedInside: () => {
      return true;
    },
    propertyConfig: {
      styles: {
        color: {
          nameOptions: colorPalette,
          rangeOptions: colorRange,
        },
      },
    },
    defaultWidgetPropertyModel: {
      class: `list-disc list-inside ${customClass || ''}`,
    },
    children,
  };
}

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
        class: '',
        src: '',
        alt: '',
      },
    },
    listWidget([listItemWidget()]),
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
    linkWidget('Home'),
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
    {
      id: 'list-widget1',
      widgetName: 'List',
      widgetType: 'list',
      canNotBeAddedInside: (widget) => {
        return true;
      },
      propertyConfig: {
        styles: {
          color: {
            nameOptions: colorPalette,
            rangeOptions: colorRange,
          },
        },
      },
      defaultWidgetPropertyModel: {
        class: 'list-disc list-inside',
      },
      children: [
        {
          id: 'list-item-widget',
          widgetName: 'ListItem',
          widgetType: 'list-item',
          canNotBeAddedInside: (widget) => {
            return true;
          },
          propertyConfig: {
            styles: {
              color: {
                nameOptions: colorPalette,
                rangeOptions: colorRange,
              },
            },
            hasContent: true,
          },
          defaultWidgetPropertyModel: {
            content: 'List Item',
          },
        },
      ],
    },
    {
      id: 'header-widget',
      widgetName: 'Header',
      widgetType: 'header',
      canNotBeAddedInside: (widget) => {
        return widget.widgetType === 'header' || widget.widgetType === 'section';
      },
      defaultWidgetPropertyModel: {
        class: 'bg-gray-white h-16 flex items-center px-4',
      },
      children: [
        {
          id: 'row-widget',
          widgetName: 'Row',
          widgetType: 'row',
          canNotBeAddedInside: (widget) => {
            return widget.widgetType === 'row'; // TBD;
          },
          defaultWidgetPropertyModel: {
            class: 'flex gap-x-2 h-full',
          },
          children: [
            {
              id: 'column-widget',
              widgetName: 'Column',
              widgetType: 'column',
              canNotBeAddedInside: (widget) => {
                return widget.widgetType === 'column'; // TBD;
              },
              defaultWidgetPropertyModel: {
                class: 'grow pl-2 pr-2  flex h-full items-center ',
              },
              children: [
                {
                  id: 'image-widget',
                  widgetName: 'Image',
                  widgetType: 'image',
                  // renderContent:
                  //   'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
                  canNotBeAddedInside: (widget) => {
                    return true;
                  },
                  propertyConfig: {
                    hasContent: true,
                  },
                  defaultWidgetPropertyModel: {
                    class: 'w-[50px]',
                    src: '',
                    alt: '',
                    content:
                      'https://cdn-icons-png.freepik.com/512/5200/5200787.png?ga=GA1.1.859669412.1773966547',
                  },
                },
              ],
            },
            {
              id: 'column-widget',
              widgetName: 'Column',
              widgetType: 'column',
              canNotBeAddedInside: (widget) => {
                return widget.widgetType === 'column'; // TBD;
              },
              defaultWidgetPropertyModel: {
                class: 'grow pl-2 pr-2  flex h-full items-center ',
              },
              children: [
                {
                  id: 'text-widget',
                  widgetName: 'Text',
                  widgetType: 'text',
                  canNotBeAddedInside: (widget) => {
                    return true;
                  },
                  propertyConfig: {
                    hasContent: true,
                  },
                  defaultWidgetPropertyModel: {
                    class: 'font-bold text-lg',
                    content: 'Discover',
                  },
                },
              ],
            },
            {
              id: 'column-widget',
              widgetName: 'Column',
              widgetType: 'column',
              canNotBeAddedInside: (widget) => {
                return widget.widgetType === 'column'; // TBD;
              },
              defaultWidgetPropertyModel: {
                class: 'grow flex pl-2 pr-2 flex h-full items-center ',
              },
              children: [
                listWidget(
                  [listItemWidget(linkWidget('Home')), listItemWidget(linkWidget('Contact'))],
                  'flex gap-x-2 list-none',
                ),
              ],
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
