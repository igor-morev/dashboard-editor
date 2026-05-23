import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import {
  Widget,
  WidgetPropertyModel,
} from '@app/application-project-editor/types/application-editor.type';
import { columnWidget } from './column';
import { containerWidget } from './container';
import { headingWidget } from './heading';
import { imageWidget } from './image';
import { linkWidget } from './link';
import { listWidget } from './list';
import { listItemWidget } from './list-item';
import { rowWidget } from './row';
import { textWidget } from './text';

export interface FooterContent {
  logoSrc?: string;
  brandName?: string;
  copyright: string;
  // Группы ссылок (каждая группа — заголовок + массив ссылок)
  linkGroups: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  socials?: Array<{ icon: string; href: string }>;
}

const FooterDefaultContent: FooterContent = {
  logoSrc: 'https://cdn-icons-png.flaticon.com/512/190/190411.png?w=360',
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
              imageWidget({ src: data.logoSrc, class: 'mx-auto h-10 mb-6' }),
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
              imageWidget({ src: data.logoSrc, class: 'h-8 mb-4' }),
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
          rowWidget(
            [
              columnWidget(
                [
                  headingWidget({ content: 'Stay updated' }),
                  textWidget({ content: 'Join our list' }),
                ],
                { class: 'w-1/2' },
              ),
              columnWidget(
                [
                  /* Тут будет виджет формы или инпут */
                ],
                { class: 'w-1/2' },
              ),
            ],
            { class: 'mb-12 pb-12 border-b' },
          ),
          rowWidget([textWidget({ content: data.copyright })]),
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
