import { Widget } from '@app/application-project-editor/types/widget.type';
import { columnWidget } from '../column';
import { containerWidget } from '../container';
import { headingWidget } from '../heading';
import { linkButtonWidget } from '../link-button';
import { rowWidget } from '../row';
import { sectionWidget } from '../section';
import { textWidget } from '../text';
import { blockWidget } from '../block';

export interface BannerContent {
  title: string;
  description?: string;
  buttonText?: string;
  imageSrc?: string;
  badge?: string; // Маленькая метка, например "New" или "Sale"
}

export type BannerLayout =
  | 'simple-row'
  | 'split-accent'
  | 'image-background'
  | 'floating-bottom'
  | 'minimal-inline';

export function bannerWidget(layout: BannerLayout = 'simple-row', content?: BannerContent): Widget {
  const layoutTransformer = (currentLayout: BannerLayout, data: BannerContent) => {
    // Атомы
    const badge = data.badge
      ? textWidget({
          content: data.badge,
          class: 'bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full w-fit mb-4',
        })
      : null;

    const title = headingWidget({
      content: data.title,
      class: 'text-project-h3 font-bold mb-2 leading-tight',
    });

    const text = data.description
      ? textWidget({
          content: data.description,
        })
      : null;

    const button = data.buttonText
      ? linkButtonWidget({
          content: data.buttonText,
        })
      : null;

    const layouts: Record<BannerLayout, Widget[]> = {
      // 1. Простая полоса: Текст слева, кнопка справа
      'simple-row': [
        containerWidget(
          [
            blockWidget([
              rowWidget(
                [
                  columnWidget([title!, text!].filter(Boolean)),
                  columnWidget([button!].filter(Boolean)),
                ],
                { class: 'items-center justify-between gap-6' },
              ),
            ],       { class: 'py-8 px-6 bg-surface border rounded-theme' }        )
          ],
        ),
      ],

      // 2. Акцентный сплит: Текст и кнопка на ярком фоне
      'split-accent': [
        containerWidget(
          [
            blockWidget([
                rowWidget(
                  [
                    columnWidget([badge!, title!, text!].filter(Boolean), { class: 'w-full lg:w-2/3' }),
                    columnWidget([button!].filter(Boolean), {
                      class: 'w-full lg:w-1/3 flex lg:justify-end mt-6 lg:mt-0',
                    }),
                  ],
                  { class: 'items-center' },
                ),
              ],
              { class: 'py-6 px-6 bg-contrast text-white rounded-theme' }
            )
          ]
        ),
      ],

      // 3. С картинкой на фоне
      'image-background': [
        containerWidget(
          [
            columnWidget([title, text!, rowWidget([button!].filter(Boolean), { class: 'mt-8' })], {
              class: 'max-w-xl py-12 text-white',
            }),
          ],
          {
            class: 'bg-cover bg-center rounded-theme overflow-hidden px-10',
            // Ссылка на imageSrc пойдет в стили через propertyModel
          },
        ),
      ],

      // 4. Плавающий снизу (Sticky Banner)
      'floating-bottom': [
        rowWidget([columnWidget([title!, text!].filter(Boolean), { class: 'grow' }), button!], {
          class:
            'fixed bottom-4 left-4 right-4 z-50 bg-white shadow-2xl p-4 rounded-xl border items-center justify-between flex animate-bounce-in',
        }),
      ],

      // 5. Минималистичный инлайн (для вставки между секциями)
      'minimal-inline': [
        containerWidget([
          rowWidget(
            [
              textWidget({ content: '🔥', class: 'text-2xl mr-4' }),
              title,
              columnWidget([button!].filter(Boolean), { class: 'ml-auto pl-4' }),
            ],
            { class: 'items-center justify-center py-4 border-y border-primary/20' },
          ),
        ]),
      ],
    };

    return layouts[currentLayout];
  };

  const defaultContent: BannerContent = content || {
    title: 'Ready to grow your business?',
    description: 'Join over 1,000+ companies using our platform to scale.',
    buttonText: 'Start Free Trial',
    badge: 'Limited Offer',
    imageSrc: 'https://unsplash.com',
  };

  return {
    ...sectionWidget(),
    id: 'banner-widget',
    widgetName: 'Banner',
    widgetType: 'section',
    propertyConfig: {
      layout: {
        options: [
          'simple-row',
          'split-accent',
          'image-background',
          'floating-bottom',
          'minimal-inline',
        ],
      },
    },
    defaultWidgetPropertyModel: {
      ...sectionWidget().defaultWidgetPropertyModel,
      layout,
      content: defaultContent as Record<string, any>,
      styles: {
        background: {
          image: layout === 'image-background' ? defaultContent.imageSrc : '',
          size: 'cover',
        },
      },
    },
    layoutTransformer,
    children: layoutTransformer(layout, defaultContent),
  } as Widget;
}
