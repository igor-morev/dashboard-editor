import { Widget, WidgetPropertyConfig } from '@app/application-project-editor/types/widget.type';
import { sectionWidget } from '../section';
import { containerWidget } from '../container';
import { headingWidget } from '../heading';
import { textWidget } from '../text';
import { linkButtonWidget } from '../link-button';
import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { cardWidget } from '../card';

export type FeaturesLayout = 'card-centered';

export interface FeaturesContent {
  title: string;
  subtitle: string;
  buttonText: string;
  items: Array<{
    title: string;
    description: string;
    imageSrc: string;
  }>;
}

export function featureSectionWidget(
  layout: FeaturesLayout = 'card-centered',
  content: FeaturesContent = {
    title: 'Which screening are you looking for?',
    subtitle: 'After you complete your registration and your kit is ordered',
    buttonText: 'Order Now',
    items: [
      {
        title: 'Colorectal Cancer Screening',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel gravida arcu.',
        imageSrc: 'https://cdn-icons-png.flaticon.com/512/190/190411.png?w=360',
      },
      {
        title: 'Cervical Cancer Screening',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel gravida arcu.',
        imageSrc: 'https://cdn-icons-png.flaticon.com/512/190/190411.png?w=360',
      },
    ],
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

  const layoutTransformer = (layout: FeaturesLayout, content: FeaturesContent) => {
    // Контентные блоки
    const contentStack = [
      headingWidget({
        class: 'text-project-h2',
        content: content.title,
        onUpdate: (newContent) => {
          // TODO: оптимизировать обновление контента (может быть через useState в реальной реализации)
          content.title = newContent;
        },
      }),
      textWidget({
        class: 'mb-6',
        content: content.subtitle,
        onUpdate: (newContent) => {
          content.subtitle = newContent;
        },
      }),
      linkButtonWidget({ content: content.buttonText, class: 'mb-12' }),
      content.items.map((item) =>
        cardWidget({
          title: item.title,
          description: item.description,
          imageUrl: item.imageSrc,
        }),
      ),
    ].flat();

    // Маппинг структур через "вшитые" классы
    const layouts: Record<FeaturesLayout, Widget[]> = {
      'card-centered': [
        containerWidget(contentStack, {
          class: 'mx-auto text-center flex flex-col items-center',
        }),
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
