import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { Widget } from '@app/application-project-editor/types/widget.type';
import { columnWidget } from '../column';
import { containerWidget } from '../container';
import { imageWidget } from '../image';
import { linkWidget } from '../link';
import { linkButtonWidget } from '../link-button';
import { listWidget } from '../list';
import { listItemWidget } from '../list-item';
import { rowWidget } from '../row';
import { textWidget } from '../text';
import { iconWidget } from '../icon';
import { iconButtonWidget } from '../icon-button';

export interface HeaderContent {
  logoUrl: string;
  brandName: string;
  navLinks: Array<{ label: string; href: string }>;
  cta: { label: string; href: string };
}

export type HeaderLayout = 'classic' | 'centered-logo' | 'nav-center' | 'minimal' | 'stacked';

export function headerWidget(layout: HeaderLayout = 'classic', content?: HeaderContent): Widget {
  const layoutTransformer = (currentLayout: HeaderLayout, data: HeaderContent) => {
    // Подготовка атомов
    const logo = columnWidget([
      imageWidget({
        content: data.logoUrl || 'https://cdn-icons-png.freepik.com/512/5200/5200787.png',
        class: 'w-[50px] min-w-[50px] object-contain',
      }),
    ]);

    const brand = columnWidget(
      [
        textWidget({
          content: data.brandName || 'Discover',
          class: 'font-bold text-contrast',
        }),
      ],
      { class: 'flex items-center' },
    );

    // Классическая навигация для десктопа (прячется на мобилках через hidden lg:flex)
    const desktopNav = columnWidget(
      [
        listWidget(
          data.navLinks.map((link) => listItemWidget(linkWidget(link.label))),
          'gap-x-4 list-none items-center h-full flex', // lg: flex
        ),
      ],
      { class: 'items-center hidden @md:block' },
    );

    // Кнопка CTA
    const cta = columnWidget([linkButtonWidget({ content: data.cta?.label || 'Get Started' })], {
      class: 'text-right hidden @sm:block', // Скрываем на совсем маленьких телефонах для экономии места
    });

    // Иконка Бургера (показывается только на мобилках, скрывается на десктопе через lg:hidden)
    const burgerIcon = columnWidget(
      [
        iconButtonWidget([iconWidget({ content: 'menu', class: 'w-6 h-6' })], {
          class: 'p-0 bg-transparent border-none header-burger-icon',
          content: '',
        }),
      ],
      { class: 'flex items-center justify-end @md:hidden' },
    );

    const layouts: Record<HeaderLayout, Widget[]> = {
      // 1. Лого (слева) --- Навигация (центр) --- Кнопка (справа)
      classic: [
        containerWidget(
          [
            rowWidget([
              rowWidget([
                rowWidget([logo, brand]), desktopNav], {
                class: 'items-center justify-between w-full flex-row',
              }),
              rowWidget([cta, burgerIcon], { class: 'items-center ml-auto justify-end' }),
            ])
          ]
        ),
      ],

      // 2. Лого (по центру) --- Навигация и кнопка по бокам
      'centered-logo': [
        containerWidget([
          rowWidget([
            rowWidget([desktopNav, logo], {
              class: 'items-center justify-between w-full flex-row',
            }),
            rowWidget([cta, burgerIcon], { class: 'items-center gap-x-2 ml-auto justify-end' }),
          ]),
        ])
      ],

      // 3. Лого (слева) --- Пустота --- Навигация (справа)
      'nav-center': [
        containerWidget([
          rowWidget([logo, desktopNav, burgerIcon, cta], {
            class: 'items-center justify-between w-full flex-row',
          }),
        ])
      ],

      // 4. Только лого и навигация (без кнопок)
      minimal: [
        containerWidget([
          rowWidget([
            rowWidget([logo, desktopNav], {
              class: 'items-center justify-between w-full flex-row',
            }),
            rowWidget([burgerIcon], { class: 'items-center gap-x-2 ml-auto justify-end' }),
          ]),
        ])
      ],

      // 5. Двухэтажный (Лого вверху, меню внизу)
      stacked: [
        containerWidget(
          [
            rowWidget([logo, brand], { class: 'justify-center items-center py-2' }),
            rowWidget([desktopNav, cta, burgerIcon], { class: 'justify-center border-t py-2' }),
          ],
          { class: 'w-full' },
        ),
      ],
    };

    return layouts[currentLayout];
  };

  const defaultContent: HeaderContent = content || {
    logoUrl: 'https://cdn-icons-png.freepik.com/512/5200/5200787.png',
    brandName: 'Discover',
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'Contact', href: '/contact' },
    ],
    cta: { label: 'Explore', href: '#' },
  };

  return {
    id: 'header-widget',
    widgetName: 'Header',
    widgetType: 'header',
    canNotBeAddedInside: (widget) =>
      widget.widgetType === 'header' || widget.widgetType === 'section',
    propertyConfig: {
      layout: {
        options: ['classic', 'centered-logo', 'nav-center', 'minimal', 'stacked'],
      },
      styles: { backgroundColor: { nameOptions: colorPalette, rangeOptions: colorRange } },
    },
    defaultWidgetPropertyModel: {
      layout,
      content: defaultContent as Record<string, any>,
      class: 'bg-white shadow-sm block py-2 w-full sticky top-0 z-50', // Сделали шапку липкой
    },
    layoutTransformer,
    children: layoutTransformer(layout, defaultContent),
  } as Widget;
}
