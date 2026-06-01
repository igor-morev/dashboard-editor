import { Widget } from '@app/application-project-editor/types/widget.type';
import { headingWidget } from './heading';
import { textWidget } from './text';
import { imageWidget } from './image';
import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { iconWidget } from './icon';

export function cardWidget({
  title = 'Reproductive Carrier Screen',
  description = 'This test identifies couples who are at risk of passing inherited conditions to their children. If you or your partner are pregnant or are planning to become pregnant, this test is for you.',
  imageUrl,
}: {
  title?: string;
  description?: string;
  imageUrl?: string;
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
      class: 'rounded-theme mb-8 shadow-xs overflow-hidden',
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
          class: 'flex items-center justify-center bg-primary h-48 overflow-hidden',
        },
        children: [
          imageUrl
            ? imageWidget({
                content: imageUrl,
                alt: 'Card Image',
                class: 'm-auto h-full object-cover',
              })
            : iconWidget({
                content: 'photo',
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
        },
        children: [
          headingWidget({
            content: title,
            class: 'text-project-h3 mb-2',
          }),
          textWidget({
            content: description,
          }),
        ],
      },
    ],
  };
}
