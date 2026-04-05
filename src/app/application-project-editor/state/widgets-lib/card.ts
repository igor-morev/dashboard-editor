import { Widget } from '@app/application-project-editor/types/application-editor.type';
import { headingWidget } from './heading';
import { textWidget } from './text';
import { imageWidget } from './image';
import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';

export function cardWidget({
  title = 'Card Header',
  description = 'Card Body Heading',
  imageUrl = '/placeholder-icon.png',
}): Widget {
  return {
    id: 'card-widget',
    widgetName: 'Card',
    widgetType: 'block',
    canNotBeAddedInside: (widget) => {
      return ['text', 'heading'].includes(widget.widgetType);
    },
    propertyConfig: {},
    defaultWidgetPropertyModel: {
      class: 'rounded-md mb-4 shadow-xs',
    },
    children: [
      {
        id: 'card-widget-header',
        widgetName: 'Card Header',
        widgetType: 'block',
        canNotBeAddedInside: (widget) => {
          return ['text', 'heading'].includes(widget.widgetType);
        },
        propertyConfig: {},
        defaultWidgetPropertyModel: {
          class: 'flex items-center justify-center bg-blue-200 h-48',
        },
        children: [
          imageWidget({
            content: imageUrl,
            alt: 'Card Image',
            class: 'h-24 m-auto',
          }),
        ],
      },
      {
        id: 'card-widget-body',
        widgetName: 'Card Body',
        widgetType: 'block',
        canNotBeAddedInside: (widget) => {
          return ['text', 'heading'].includes(widget.widgetType);
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
          class: 'p-3',
          styles: {
            backgroundColor: {
              name: 'white',
              range: null,
            },
          },
        },
        children: [
          headingWidget({
            content: title,
            class: 'mb-2 font-bold',
          }),
          textWidget({
            content: description,
          }),
        ],
      },
    ],
  };
}
