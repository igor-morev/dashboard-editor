import { Widget } from '@app/application-project-editor/types/application-editor.type';
import { sectionWidget } from './section';
import { containerWidget } from './container';
import { headingWidget } from './heading';
import { textWidget } from './text';
import { linkButtonWidget } from './link-button';
import { imageWidget } from './image';
import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { cardWidget } from './card';

export function baseFeatureSectionWidget(): Widget {
  return {
    ...sectionWidget(),
    id: 'feature-section-widget',
    widgetName: 'Feature Section',
    children: [
      containerWidget([
        headingWidget({
          class: 'font-bold mb-2',
          content: 'One platform, proprietary software, no middlemen',
        }),
        textWidget({
          class: 'mb-4',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel gravida arcu. Vestibulum feugiat, sapien ultrices fermentum congue, quam velit venenatis sem',
        }),
      ]),
    ],
  };
}

export function featureSectionWidget1(): Widget {
  return {
    ...sectionWidget(),
    id: 'feature-section-widget1',
    widgetName: 'Feature Section With Button',
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
      ...sectionWidget().defaultWidgetPropertyModel,
      ...{
        styles: {
          backgroundColor: {
            name: 'gray',
            range: 300,
          },
        },
      },
    },
    children: [
      containerWidget([
        headingWidget({
          class: 'font-bold mb-2',
          content: 'One platform, proprietary software, no middlemen',
        }),
        textWidget({
          class: 'mb-4',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel gravida arcu. Vestibulum feugiat, sapien ultrices fermentum congue, quam velit venenatis sem',
        }),
        linkButtonWidget({
          content: 'Explore',
        }),
      ]),
    ],
  } as Widget;
}

export function featureSectionWidget2(): Widget {
  return {
    ...sectionWidget(),
    id: 'feature-section-widget2',
    widgetName: 'Feature Section With Button and Image',
    children: [
      containerWidget([
        headingWidget({
          class: 'font-bold mb-2',
          content: 'One platform, proprietary software, no middlemen',
        }),
        textWidget({
          class: 'mb-6',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel gravida arcu. Vestibulum feugiat, sapien ultrices fermentum congue, quam velit venenatis sem',
        }),
        linkButtonWidget({
          content: 'Explore',
        }),
        imageWidget({
          class: 'w-full mt-4',
          src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFkaWF0aW9uJTIwYmFubmVyfGVufDB8fDB8fHww',
          alt: 'Feature Image',
        }),
      ]),
    ],
  };
}

export function featureSectionBenefitsWidget(): Widget {
  return {
    ...sectionWidget(),
    id: 'feature-section-widget4',
    widgetName: 'Feature Benefits Section',
    children: [
      containerWidget([
        cardWidget({
          title: 'Benefit 1',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel gravida arcu.',
          imageUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png?w=360',
        }),
        cardWidget({
          title: 'Benefit 2',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel gravida arcu.',
          imageUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png?w=360',
        }),
        cardWidget({
          title: 'Benefit 3',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel gravida arcu.',
          imageUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png?w=360',
        }),
      ]),
    ],
  };
}
