import { Widget } from '@app/application-project-editor/types/application-editor.type';
import { containerWidget } from './container';
import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { headingWidget } from './heading';
import { textWidget } from './text';
import { linkButtonWidget } from './link-button';

export function heroWidget(): Widget {
  return {
    id: 'hero-widget',
    widgetName: 'Hero',
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
      containerWidget([
        headingWidget({
          content: 'Discover Your Inner Peace with Our Meditation App',
        }),
        textWidget({
          class: 'mb-4',
          content: 'Welcome to our website! We are glad to have you here.',
        }),
        linkButtonWidget({
          content: 'Get Started',
        }),
      ]),
    ],
  };
}
