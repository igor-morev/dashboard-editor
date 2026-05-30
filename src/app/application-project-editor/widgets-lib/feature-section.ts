import { Widget, WidgetPropertyConfig } from '@app/application-project-editor/types/widget.type';
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

export interface FeatureContent {
  heading: string;
  description: string;
  buttonText: string;
  image: {
    src: string;
    alt: string;
  };
}

export function featureSectionWidget(
  layout: FeatureLayout = 'stack',
  content: FeatureContent = {
    heading: 'Which screening are you looking for?',
    description: 'After you complete your registration and your kit is ordered',
    buttonText: 'Order Now',
    image: {
      src: 'https://cdn-icons-png.flaticon.com/512/190/190411.png?w=360',
      alt: 'Feature Image',
    },
  },
): Widget {
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

  const layoutTransformer = (layout: FeatureLayout, content: FeatureContent) => {
    // Контентные блоки
    const contentStack = [
      headingWidget({
        class: 'text-project-h2',
        content: content.heading,
        onUpdate: (newContent) => {
          // TODO: оптимизировать обновление контента (может быть через useState в реальной реализации)
          console.log(content);
          content.heading = newContent;
        },
      }),
      textWidget({
        class: 'mb-6',
        content: content.description,
        onUpdate: (newContent) => {
          content.description = newContent;
        },
      }),
      cardWidget({}),
      linkButtonWidget({ content: content.buttonText }),
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
            columnWidget([
              imageWidget({
                class: 'w-full rounded-lg',
                src: content.image.src,
                alt: content.image.alt,
              }),
            ]),
          ]),
        ]),
      ],

      // 3. Текст справа, картинка слева
      'split-left': [
        containerWidget([
          rowWidget([
            columnWidget([imageWidget({ class: 'w-full rounded-lg', src: content.image.src })]),
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
              headingWidget({ content: content.heading }),
              textWidget({
                content: content.description,
              }),
              imageWidget({
                class: 'w-full rounded-lg',
                src: content.image.src,
                alt: content.image.alt,
              }),
            ]),
            columnWidget([
              headingWidget({ content: content.heading }),
              textWidget({
                content: content.description,
              }),
              imageWidget({
                class: 'w-full rounded-lg',
                src: content.image.src,
                alt: content.image.alt,
              }),
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
      layout,
      content: content as Record<string, any>,
    },
    layoutTransformer,
    children: layoutTransformer(layout, content),
  } as Widget;
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
