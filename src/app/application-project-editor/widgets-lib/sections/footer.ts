import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { Widget } from '@app/application-project-editor/types/widget.type';
import { columnWidget } from '../column';
import { containerWidget } from '../container';
import { headingWidget } from '../heading';
import { imageWidget } from '../image';
import { linkWidget } from '../link';
import { listWidget } from '../list';
import { listItemWidget } from '../list-item';
import { rowWidget } from '../row';
import { textWidget } from '../text';
import { buttonWidget } from '../button';
import { formWidget } from '../form/form';
import { textInputWidget } from '../form/text-input';

export interface FooterContent {
  logoUrl?: string;
  brandName?: string;
  copyright: string;
  // Группы ссылок (каждая группа — заголовок + массив ссылок)
  linkGroups: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  socials?: Array<{ icon: string; href: string }>;
  newsletter?: {
    title: string;
    subtitle: string;
    placeholder: string;
    buttonText: string;
  };
}

const FooterDefaultContent: FooterContent = {
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png?w=360',
  brandName: 'YourBrand',
  copyright: '© 2024 YourBrand. All rights reserved.',
  linkGroups: [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Blog', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
  ],
  socials: [
    { icon: 'facebook', href: '#' },
    { icon: 'twitter', href: '#' },
    { icon: 'linkedin', href: '#' },
  ],
  newsletter: {
    title: 'Subscribe to our Newsletter',
    subtitle: 'Get the latest updates and offers.',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe',
  },
};

export type FooterLayout =
  | 'simple-center'
  | 'logo-left-links-right'
  | 'multi-column'
  | 'newsletter-split'
  | 'minimal-split';

export function footerWidget(
  layout: FooterLayout = 'simple-center',
  content: FooterContent = FooterDefaultContent,
): Widget {
  const layoutTransformer = (currentLayout: FooterLayout, data: FooterContent) => {
    // Хелпер для создания колонки ссылок
    const createLinkColumn = (group: { title: string; links: any[] }) =>
      columnWidget([
        headingWidget({ content: group.title, class: 'font-semibold uppercase mb-4' }),
        listWidget(
          group.links.map((l) => listItemWidget(linkWidget(l.label))),
          'space-y-2 list-none',
        ),
      ]);

    const layouts: Record<FooterLayout, Widget[]> = {
      // 1. По центру: Лого -> Ссылки в ряд -> Копирайт
      'simple-center': [
        containerWidget(
          [
            columnWidget([
              imageWidget({ src: data.logoUrl, class: 'mx-auto h-10 mb-6' }),
              listWidget(
                data.linkGroups[0].links.map((l) => listItemWidget(linkWidget(l.label))),
                'flex justify-center gap-6 mb-6 list-none',
              ),
              textWidget({ content: data.copyright, class: 'text-center' }),
            ]),
          ],
          {
            class: 'text-center',
          },
        ),
      ],

      // 2. Классика: Лого слева, 2-3 колонки ссылок справа
      'logo-left-links-right': [
        containerWidget([
          rowWidget([
            columnWidget([
              imageWidget({ src: data.logoUrl, class: 'h-8 mb-4' }),
              textWidget({ content: data.brandName }),
            ]),
            ...data.linkGroups.slice(0, 2).map(createLinkColumn),
          ]),
        ]),
      ],

      // 3. Мульти-колоночный (для больших сайтов/Fintech)
      'multi-column': [
        containerWidget([
          rowWidget(data.linkGroups.map(createLinkColumn)),
          rowWidget([textWidget({ content: data.copyright, class: 'mt-10 pt-6 border-t w-full' })]),
        ]),
      ],

      // 4. С формой подписки (Banner + Footer)
      'newsletter-split': [
        containerWidget([
          // Используем flex-col для вертикального стека,
          // и lg:flex-row только для десктопов, если захочешь вернуть сплит
          rowWidget(
            [
              // Текстовый блок: теперь на всю ширину
              columnWidget(
                [
                  headingWidget({
                    content: content.newsletter?.title,
                    class: 'text-project-h3 font-bold mb-2',
                  }),
                  textWidget({
                    content: content.newsletter?.subtitle,
                    class: 'mb-6', // Добавили отступ снизу
                  }),
                ],
                { class: 'w-full' },
              ),
              // Блок формы: теперь строго под текстом
              columnWidget(
                [
                  formWidget([
                    rowWidget(
                      [
                        columnWidget(
                          [
                            textInputWidget({
                              placeholder: content.newsletter?.placeholder,
                              inputType: 'email',
                              class: 'w-full',
                              required: true,
                            }),
                          ],
                          { class: 'grow' },
                        ),
                        columnWidget(
                          [
                            buttonWidget({
                              type: 'submit',
                              content: content.newsletter?.buttonText,
                            }),
                          ],
                          { class: 'flex-none' },
                        ),
                      ],
                      { class: 'flex flex-col sm:flex-row gap-3 items-stretch' },
                    ),
                    // На мобилках даже инпут и кнопка будут друг под другом (flex-col)
                  ]),
                ],
                { class: 'w-full max-w-lg' }, // Ограничиваем ширину формы для красоты
              ),
            ],
            { class: 'mb-12 pb-12 border-b border-white/10 flex-col items-start' },
          ),
          rowWidget([
            textWidget({
              content: data.copyright,
              class: 'text-sm',
            }),
          ]),
        ]),
      ],

      // 5. Минимализм в одну строку
      'minimal-split': [
        containerWidget([
          rowWidget([
            textWidget({ content: data.copyright }),
            listWidget(
              data.linkGroups[0].links.map((l) => listItemWidget(linkWidget(l.label))),
              'list-none',
            ),
          ]),
        ]),
      ],
    };

    return layouts[currentLayout];
  };

  return {
    id: 'footer-widget',
    widgetName: 'Footer',
    widgetType: 'footer',
    propertyConfig: {
      layout: {
        options: [
          'simple-center',
          'logo-left-links-right',
          'multi-column',
          'newsletter-split',
          'minimal-split',
        ],
      },
      styles: {
        backgroundColor: { nameOptions: colorPalette, rangeOptions: colorRange },
        color: { nameOptions: colorPalette, rangeOptions: colorRange },
      },
    },
    defaultWidgetPropertyModel: {
      layout,
      class: 'py-12 bg-contrast text-white',
      content: content as Record<string, any>, // Дефолтные данные, если ничего не передано
    },
    layoutTransformer,
    children: layoutTransformer(layout, content!),
  } as Widget;
}
