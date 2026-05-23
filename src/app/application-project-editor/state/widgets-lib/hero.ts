import { Widget } from '@app/application-project-editor/types/application-editor.type';
import { containerWidget } from './container';
import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { headingWidget } from './heading';
import { textWidget } from './text';
import { linkButtonWidget } from './link-button';
import { columnWidget } from './column';
import { imageWidget } from './image';
import { rowWidget } from './row';

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  imageSrc?: string; // Для лейаутов со сплитом
  videoUrl?: string; // Опционально
}

export type HeroLayout =
  | 'centered-overlay'
  | 'split-right'
  | 'split-left'
  | 'bottom-aligned'
  | 'minimal-box';

export function heroWidget(layout: HeroLayout = 'centered-overlay', content?: HeroContent): Widget {
  const layoutTransformer = (currentLayout: HeroLayout, data: HeroContent) => {
    const heading = headingWidget({
      content: data.title,
      class: 'text-project-h1 mb-4',
    });
    const text = textWidget({
      content: data.subtitle,
      class: 'text-lg mb-4',
    });
    const button = linkButtonWidget({
      content: data.ctaText,
    });

    const contentStack = [heading, text, button];

    const layouts: Record<HeroLayout, Widget[]> = {
      // 1. Контент по центру поверх фона
      'centered-overlay': [
        containerWidget([rowWidget([columnWidget(contentStack, { class: 'text-center' })])], {
          class: 'py-40',
        }),
      ],

      // 2. Сплит: Текст слева, Картина справа (актуально, если фон пустой)
      'split-right': [
        containerWidget(
          [
            rowWidget([
              columnWidget(contentStack, { class: 'w-full text-left' }),
              columnWidget(
                [imageWidget({ src: data.imageSrc, class: 'rounded-theme shadow-2xl' })],
                {
                  class: 'w-full',
                },
              ),
            ]),
          ],
          { class: 'py-40' },
        ),
      ],

      // 3. Сплит: Картина слева, Текст справа
      'split-left': [
        containerWidget(
          [
            rowWidget([
              columnWidget(
                [imageWidget({ src: data.imageSrc, class: 'rounded-theme shadow-2xl' })],
                {
                  class: 'w-full',
                },
              ),
              columnWidget(contentStack, { class: 'w-full text-left' }),
            ]),
          ],
          { class: 'py-40' },
        ),
      ],

      // 4. Прижатый к низу контент (эффект кино)
      'bottom-aligned': [
        containerWidget([rowWidget([columnWidget(contentStack, { class: 'text-left mt-auto' })])], {
          class: 'min-h-[70vh] pt-20 pb-8 flex',
        }),
      ],

      // 5. Контент в "коробке" (Glassmorphism / Card)
      'minimal-box': [
        containerWidget(
          [
            rowWidget([
              columnWidget(contentStack, {
                class: 'bg-white/10 backdrop-blur-md rounded-theme border border-white/20 p-4',
              }),
            ]),
          ],
          { class: 'py-40' },
        ),
      ],
    };

    return layouts[currentLayout];
  };

  const defaultContent: HeroContent = content || {
    title: 'Discover Your Inner Peace with Our Meditation App',
    subtitle: 'Welcome to our website! We are glad to have you here.',
    ctaText: 'Get Started',
    imageSrc: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  };

  return {
    id: 'hero-widget',
    widgetName: 'Hero',
    widgetType: 'section',
    canNotBeAddedInside: (widget) => {
      return widget.widgetType === 'section';
    },
    propertyConfig: {
      layout: {
        options: ['centered-overlay', 'split-right', 'split-left', 'bottom-aligned', 'minimal-box'],
      },
      // ... твои стили фона и текста
    },
    defaultWidgetPropertyModel: {
      layout,
      class: 'relative',
      styles: {
        background: {
          image: defaultContent.imageSrc,
          size: 'cover',
          position: 'center',
        },
        color: { name: 'white', range: null },
        textAlign: layout.includes('centered') ? 'center' : 'left',
      },
      content: defaultContent as Record<string, any>, // Сохраняем весь контент в модели для удобства
    },
    layoutTransformer,
    children: layoutTransformer(layout, defaultContent),
  } as Widget;
}
