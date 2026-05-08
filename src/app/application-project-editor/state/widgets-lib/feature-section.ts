import {
  Widget,
  WidgetPropertyConfig,
} from '@app/application-project-editor/types/application-editor.type';
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
import { columnWidget } from './column';
import { rowWidget } from './row';

export type FeatureLayout =
  | 'stack'
  | 'split-right'
  | 'split-left'
  | 'card-centered'
  | 'side-by-side';

export function featureSectionWidget(layout: FeatureLayout = 'stack'): Widget {
  // Базовая конфигурация редактора (одинаковая для всех)
  const sharedConfig: WidgetPropertyConfig = {
    styles: {
      backgroundColor: { nameOptions: colorPalette, rangeOptions: colorRange },
      color: { nameOptions: colorPalette, rangeOptions: colorRange },
      textAlign: ['left', 'center', 'right'],
      padding: { visible: true },
    },
    layout: {
      options: ['stack', 'split-right', 'split-left', 'card-centered', 'side-by-side'],
    },
  };

  const layoutTransformer = (layout: FeatureLayout) => {
    // Контентные блоки
    const contentStack = [
      headingWidget({ class: 'font-bold text-3xl mb-4', content: 'Feature Heading' }),
      textWidget({ class: 'text-base mb-6 opacity-80', content: 'Description text goes here...' }),
      linkButtonWidget({ content: 'Action Button' }),
    ];

    // Маппинг структур через "вшитые" классы
    const layouts: Record<FeatureLayout, Widget[]> = {
      // 1. Вертикальный стек (классика)
      stack: [containerWidget(contentStack)],

      // 2. Текст слева, картинка справа (через Row/Column)
      'split-right': [
        containerWidget([
          rowWidget([
            columnWidget(contentStack),
            columnWidget([imageWidget({ class: 'w-full rounded-lg' })]),
          ]),
        ]),
      ],

      // 3. Текст справа, картинка слева
      'split-left': [
        containerWidget([
          rowWidget([
            columnWidget([imageWidget({ class: 'w-full rounded-lg' })]),
            columnWidget(contentStack),
          ]),
        ]),
      ],

      // 4. Центрированная карточка (Hero-like feature)
      'card-centered': [
        containerWidget(contentStack, {
          class: 'max-w-4xl mx-auto text-center flex flex-col items-center p-12',
        }),
      ],

      // 5. Две колонки текста (без картинок)
      'side-by-side': [
        containerWidget([
          rowWidget([
            columnWidget([
              headingWidget({ content: 'Feature A' }),
              textWidget({
                content: 'Description text goes here...',
              }),
              imageWidget({ class: 'w-full rounded-lg' }),
            ]),
            columnWidget([
              headingWidget({ content: 'Feature B' }),
              textWidget({
                content: 'Description text goes here...',
              }),
              imageWidget({ class: 'w-full rounded-lg' }),
            ]),
          ]),
        ]),
      ],
    };

    return layouts[layout];
  };

  return {
    ...sectionWidget(),
    id: 'feature-section-widget',
    widgetName: 'Feature Section',
    propertyConfig: sharedConfig,
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
      layout,
      class: 'pt-10 pb-10',
    },
    layoutTransformer,
    children: layoutTransformer(layout),
  } as Widget;
}

// export function featureSectionWidget2(): Widget {
//   return {
//     ...sectionWidget(),
//     id: 'feature-section-widget2',
//     widgetName: 'Feature Section With Button and Image',
//     children: [
//       containerWidget([
//         headingWidget({
//           class: 'font-bold mb-2',
//           content: 'One platform, proprietary software, no middlemen',
//         }),
//         textWidget({
//           class: 'mb-6',
//           content:
//             'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel gravida arcu. Vestibulum feugiat, sapien ultrices fermentum congue, quam velit venenatis sem',
//         }),
//         linkButtonWidget({
//           content: 'Explore',
//         }),
//         imageWidget({
//           class: 'w-full mt-4',
//           src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFkaWF0aW9uJTIwYmFubmVyfGVufDB8fDB8fHww',
//           alt: 'Feature Image',
//         }),
//       ]),
//     ],
//   };
// }

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
