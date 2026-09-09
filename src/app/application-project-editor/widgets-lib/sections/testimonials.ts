import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { Widget } from '@app/application-project-editor/types/widget.type';
import { columnWidget } from '../column';
import { containerWidget } from '../container';
import { headingWidget } from '../heading';
import { imageWidget } from '../image';
import { rowWidget } from '../row';
import { sectionWidget } from '../section';
import { textWidget } from '../text';

export interface TestimonialItem {
  author: string;
  role: string;
  text: string;
  avatar: string;
  rating?: number;
}

export interface TestimonialsContent {
  title: string;
  subtitle?: string;
  items: TestimonialItem[];
}

export type TestimonialsLayout = 'grid' | 'single-quote' | 'side-by-side' | 'bubbles';

export function testimonialsWidget(
  layout: TestimonialsLayout = 'grid',
  content?: TestimonialsContent,
): Widget {
  const layoutTransformer = (currentLayout: TestimonialsLayout, data: TestimonialsContent) => {
    // Хелпер для создания карточки отзыва
    const createReviewCard = (rev: TestimonialItem, classes: string) =>
      columnWidget(
        [
          // Рейтинг (звездочки)
          textWidget({ content: '★'.repeat(rev.rating || 5), class: 'text-contrast mb-4' }),
          // Текст отзыва
          textWidget({ content: `"${rev.text}"`, class: 'text-lg italic mb-6 opacity-90' }),
          // Блок автора
          rowWidget(
            [
              imageWidget({
                src: rev.avatar,
                class: 'w-12 h-12 min-w-12 min-h-12 rounded-full object-cover',
              }),
              columnWidget(
                [
                  textWidget({ content: rev.author, class: 'font-bold' }),
                  textWidget({
                    content: rev.role,
                    // styles: {
                    //   color: {
                    //     name: 'gray',
                    //     range: 500,
                    //   },
                    // },
                  }),
                ],
                { class: 'inline-flex flex-col' },
              ),
            ],
            { class: 'items-center gap-4 mt-auto' },
          ),
        ],
        { defaultClass: '', class: classes },
      );

    const layouts: Record<TestimonialsLayout, Widget[]> = {
      // 1. Классическая сетка (для Grooming или Healthcare)
      grid: [
        containerWidget([
          columnWidget([
            headingWidget({
              content: data.title,
              class: 'text-project-h2 font-bold text-center mb-4',
            }),
            textWidget({
              content: data.subtitle,
              class: 'text-center mb-12',
              styles: {
                color: {
                  name: 'gray',
                  range: 500,
                },
              },
            }),
          ]),
          rowWidget(
            data.items.map((rev) =>
              createReviewCard(
                rev,
                'grow w-[calc(50%-0.5rem)] p-4 border rounded-2xl flex flex-col shadow-sm',
              ),
            ),
            { class: 'flex-wrap' },
          ),
        ]),
      ],

      // 2. Одна большая цитата (для Hero-блока или акцента)
      'single-quote': [
        containerWidget([
          columnWidget(
            [
              textWidget({ content: '“', class: 'text-6xl font-serif text-primary mb-2' }),
              textWidget({ content: data.items[0].text, class: 'font-medium mb-8' }),
              rowWidget(
                [
                  imageWidget({ src: data.items[0].avatar, class: 'w-16 h-16 rounded-full' }),
                  columnWidget([
                    textWidget({ content: data.items[0].author, class: 'font-bold text-xl' }),
                    textWidget({
                      content: data.items[0].role,
                      styles: {
                        color: {
                          name: 'gray',
                          range: 500,
                        },
                      },
                    }),
                  ]),
                ],
                { class: 'items-center gap-4 justify-center' },
              ),
            ],
            { class: 'text-center max-w-4xl mx-auto' },
          ),
        ]),
      ],

      // 3. Текст слева, отзывы справа (Side-by-Side)
      'side-by-side': [
        containerWidget([
          rowWidget([
            columnWidget(
              [
                headingWidget({ content: data.title, class: 'text-project-h3 font-bold mb-6' }),
                textWidget({
                  content: data.subtitle,
                  class: 'text-lg',
                  styles: {
                    color: {
                      name: 'gray',
                      range: 500,
                    },
                  },
                }),
              ],
              { class: 'w-full' },
            ),
            columnWidget(
              data.items
                .slice(0, 2)
                .map((rev) => createReviewCard(rev, 'p-4 border-b last:border-0')),
              { class: 'w-full' },
            ),
          ]),
        ]),
      ],

      // 4. "Пузыри" (Bubbles) — для креативных AI сайтов
      bubbles: [
        containerWidget([
          rowWidget(
            data.items.map((rev, i) =>
              createReviewCard(
                rev,
                `grow w-[calc(50%-1rem)] p-6 rounded-[40px] ${i % 2 === 0 ? '' : 'mt-12'}`,
              ),
            ),
            { class: 'gap-8 flex-wrap' },
          ),
        ]),
      ],
    };

    return layouts[currentLayout];
  };

  const defaultContent: TestimonialsContent = content || {
    title: 'What our clients say',
    subtitle: 'Over 500+ happy customers trust us with their projects',
    items: [
      {
        author: 'Sarah Johnson',
        role: 'Business Owner',
        text: 'This platform changed the way we build websites forever.',
        avatar: 'https://i.pravatar.cc/100?img=10',
        rating: 5,
      },
      {
        author: 'Mark Smith',
        role: 'Developer',
        text: 'The cleanest code I have ever seen in a low-code tool.',
        avatar: 'https://i.pravatar.cc/100?img=11',
        rating: 5,
      },
      {
        author: 'Jane Doe',
        role: 'Designer',
        text: 'Highly recommend for anyone who values time and quality.',
        avatar: 'https://i.pravatar.cc/100?img=12',
        rating: 4,
      },
    ],
  };

  return {
    ...sectionWidget(),
    id: 'testimonials-widget',
    widgetName: 'Testimonials',
    widgetType: 'section',
    propertyConfig: {
      layout: { options: ['grid', 'single-quote', 'side-by-side', 'bubbles'] },
      styles: { backgroundColor: { nameOptions: colorPalette, rangeOptions: colorRange } },
    },
    defaultWidgetPropertyModel: {
      ...sectionWidget().defaultWidgetPropertyModel,
      layout,
      content: defaultContent as Record<string, any>,
    },
    layoutTransformer,
    children: layoutTransformer(layout, defaultContent),
  } as Widget;
}
